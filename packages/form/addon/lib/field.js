import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { associateDestroyableChild } from "@ember/destroyable";
import { inject as service } from "@ember/service";
import { camelize } from "@ember/string";
import { isEmpty } from "@ember/utils";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { restartableTask, lastValue, dropTask } from "ember-concurrency";
import { validate } from "ember-validators";
import isEqual from "lodash.isequal";
import { cached } from "tracked-toolbox";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import saveDocumentDateAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-date-answer.graphql";
import saveDocumentFilesAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-files-answer.graphql";
import saveDocumentFloatAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-float-answer.graphql";
import saveDocumentIntegerAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-integer-answer.graphql";
import saveDocumentListAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-list-answer.graphql";
import saveDocumentStringAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-string-answer.graphql";
import saveDocumentTableAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-table-answer.graphql";
import getDocumentUsedDynamicOptionsQuery from "@projectcaluma/ember-form/gql/queries/document-used-dynamic-options.graphql";
import refreshAnswerQuery from "@projectcaluma/ember-form/gql/queries/refresh-answer.graphql";
import Base from "@projectcaluma/ember-form/lib/base";
import dependencies from "@projectcaluma/ember-form/lib/dependencies";

export const TYPE_MAP = {
  TextQuestion: "StringAnswer",
  TextareaQuestion: "StringAnswer",
  IntegerQuestion: "IntegerAnswer",
  FloatQuestion: "FloatAnswer",
  MultipleChoiceQuestion: "ListAnswer",
  ChoiceQuestion: "StringAnswer",
  DynamicMultipleChoiceQuestion: "ListAnswer",
  DynamicChoiceQuestion: "StringAnswer",
  TableQuestion: "TableAnswer",
  FormQuestion: null,
  FilesQuestion: "FilesAnswer",
  StaticQuestion: null,
  DateQuestion: "DateAnswer",
};

const MUTATION_MAP = {
  FloatAnswer: saveDocumentFloatAnswerMutation,
  IntegerAnswer: saveDocumentIntegerAnswerMutation,
  StringAnswer: saveDocumentStringAnswerMutation,
  ListAnswer: saveDocumentListAnswerMutation,
  FilesAnswer: saveDocumentFilesAnswerMutation,
  DateAnswer: saveDocumentDateAnswerMutation,
  TableAnswer: saveDocumentTableAnswerMutation,
};

const fieldIsHiddenOrEmpty = (field) => {
  return (
    field.hidden ||
    (!field.question.isTable &&
      (field.answer.value === null || field.answer.value === undefined))
  );
};

/**
 * An object which represents a combination of a question and an answer.
 *
 * @class Field
 */
export default class Field extends Base {
  @service intl;

  @queryManager apollo;

  constructor({ fieldset, ...args }) {
    assert("`fieldset` must be passed as an argument", fieldset);

    super({ fieldset, ...args });

    this.fieldset = fieldset;

    this.pushIntoStore();

    this._createQuestion();
    this._createAnswer();
  }

  _createQuestion() {
    const owner = getOwner(this);

    this.question =
      this.calumaStore.find(`Question:${this.raw.question.slug}`) ||
      new (owner.factoryFor("caluma-model:question").class)({
        raw: this.raw.question,
        owner,
      });

    this.question.dataSourceContext = this.document.dataSourceContext;
  }

  _createAnswer() {
    const owner = getOwner(this);
    const Answer = owner.factoryFor("caluma-model:answer").class;
    let answer;

    // no answer passed, create an empty one
    if (!this.raw.answer) {
      const answerType = TYPE_MAP[this.raw.question.__typename];

      // static questions don't have an answer
      if (!answerType) {
        return;
      }

      answer = new Answer({
        raw: {
          id: null,
          __typename: answerType,
          question: { slug: this.raw.question.slug },
          [camelize(answerType.replace(/Answer$/, "Value"))]: null,
        },
        field: this,
        owner,
      });
    } else {
      answer =
        this.calumaStore.find(`Answer:${decodeId(this.raw.answer.id)}`) ||
        new Answer({ raw: this.raw.answer, field: this, owner });
    }

    this.answer = associateDestroyableChild(this, answer);
  }

  /**
   * The question to this field
   *
   * @property {Question} question
   */
  question = null;

  /**
   * The answer to this field. It is possible for this to be `null` if the
   * question is of the static question type.
   *
   * @property {Answer} answer
   */
  answer = null;

  /**
   * The raw error objects which are later translated to readable messages.
   *
   * @property {Object[]} _errors
   * @private
   */
  @tracked _errors = [];

  /**
   * Currently rendered field components that use this field. This is used in
   * the document validity component to await all current save tasks before
   * validating.
   *
   * @property {Set} _components
   * @private
   */
  _components = new Set();

  /**
   * The primary key of the field. Consists of the document and question primary
   * keys.
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    return `${this.document.pk}:Question:${this.raw.question.slug}`;
  }

  /**
   * Whether the field is valid.
   *
   * @property {Boolean} isValid
   */
  get isValid() {
    return this.errors.length === 0;
  }

  /**
   * Whether the field is invalid.
   *
   * @property {Boolean} isInvalid
   */
  get isInvalid() {
    return !this.isValid;
  }

  /**
   * Whether the field is new (never saved to the backend service or empty)
   *
   * @property {Boolean} isNew
   */
  get isNew() {
    return !this.answer || this.answer.isNew;
  }

  /**
   * Only table values, this is used for certain computed property keys.
   *
   * @property {Document[]} tableValue
   */
  get tableValue() {
    return this.question.isTable ? this.value : [];
  }

  /**
   * Whether the field has the defined default answer of the question as value.
   *
   * @property {Boolean} isDefault
   */
  get isDefault() {
    if (!this.value || !this.question.defaultValue) return false;

    const value = this.question.isTable
      ? this.tableValue.map((doc) => doc.flatAnswerMap)
      : this.value;

    return isEqual(value, this.question.defaultValue);
  }

  /**
   * Whether the field is dirty. This will be true, if there is a value on the
   * answer which differs from the default value of the question.
   *
   * @property {Boolean} isDirty
   */
  get isDirty() {
    if (this.question.isCalculated || this.isDefault) {
      return false;
    }

    return Boolean(this.validate.lastSuccessful) || !this.isNew;
  }

  /**
   * The type of the question
   *
   * @property {String} questionType
   */
  get questionType() {
    return this.question.raw.__typename;
  }

  /**
   * The document this field belongs to
   *
   * @property {Document} document
   */
  get document() {
    return this.fieldset.document;
  }

  /**
   * The value of the field
   *
   * @property {*} value
   */
  get value() {
    if (this.question.isCalculated) {
      return this.calculatedValue;
    }

    return this.answer?.value;
  }

  /**
   * The computed value of a calculated float question
   *
   * @property {*} calculatedValue
   */
  @cached
  get calculatedValue() {
    if (
      !this.question.isCalculated ||
      !this.calculatedDependencies.every((field) => !field.hidden)
    ) {
      return null;
    }

    try {
      return this.document.jexl.evalSync(
        this.question.raw.calcExpression,
        this.jexlContext,
      );
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetch all formerly used dynamic options for this question. This will be
   * taken from the apollo cache if possible.
   *
   * @method _fetchUsedDynamicOptions.perform
   * @return {Object[]} Formerly used dynamic options
   * @private
   */
  @dropTask
  *_fetchUsedDynamicOptions() {
    if (!this.question.isDynamic) return null;

    const edges = yield this.apollo.query(
      {
        query: getDocumentUsedDynamicOptionsQuery,
        fetchPolicy: "cache-first",
        variables: {
          document: this.document.uuid,
          question: this.question.slug,
        },
      },
      "allUsedDynamicOptions.edges",
    );

    return edges.map(({ node: { slug, label } }) => ({
      slug,
      label,
    }));
  }

  /**
   * The formerly used dynamic options for this question.
   *
   * @property {Object[]} usedDynamicOptions
   */
  @lastValue("_fetchUsedDynamicOptions")
  usedDynamicOptions;

  /**
   * The available options for choice questions. This only works for the
   * following types:
   *
   * - ChoiceQuestion
   * - DynamicChoiceQuestion
   * - MultipleChoiceQuestion
   * - DynamicMultipleChoiceQuestion
   *
   * This will also return the disabled state of the option. An option can only
   * be disabled in any of the following cases:
   * - it is a dynamic option which is no longer available
   * - the option has been removed from the form using the form builder
   * - the option is no longer visible due to its JEXL
   *
   * @property {null|Object[]} options
   */
  @cached
  get options() {
    if (!this.question.isChoice && !this.question.isMultipleChoice) {
      return null;
    }

    const selected =
      (this.question.isMultipleChoice ? this.value : [this.value]) || [];

    const options = this.question.options
      .filter((option) => !option.disabled || selected.includes(option.slug))
      .map((option) => {
        if (!option.isHidden) {
          return option;
        }

        try {
          const isHidden = this.document.jexl.evalSync(
            option.isHidden,
            this.jexlContext,
          );

          if (selected.includes(option.slug) && isHidden) {
            return {
              ...option,
              _isHidden: isHidden,
              disabled: true,
            };
          }
          return {
            ...option,
            _isHidden: isHidden,
          };
        } catch (error) {
          throw new Error(
            `Error while evaluating \`isHidden\` expression on Option\`${option.slug}\`: ${error.message}`,
          );
        }
      })
      .filter(
        ({ _isHidden, disabled }) => !_isHidden || (_isHidden && disabled),
      );

    const hasUnknownValue = !selected.every((slug) =>
      options.find((option) => option.slug === slug),
    );

    if (this.question.isDynamic && hasUnknownValue) {
      if (
        !this._fetchUsedDynamicOptions.lastSuccessful &&
        this.question.dynamicOptions.isResolved
      ) {
        // Fetch used dynamic options if not done yet
        this._fetchUsedDynamicOptions.perform();
      }

      return [
        ...options,
        ...(this.usedDynamicOptions || [])
          .filter((used) => {
            return (
              selected.includes(used.slug) &&
              !options.find((option) => option.slug === used.slug)
            );
          })
          .map((used) => ({ ...used, disabled: true })),
      ];
    }

    return options;
  }

  /**
   * The currently selected option. This property is only used for choice
   * questions. It can either return null if no value is selected yet, an
   * object for single choices or an array of objects for multiple choices.
   *
   * @property {null|Object|Object[]} selected
   */
  get selected() {
    if (!this.question.isChoice && !this.question.isMultipleChoice) {
      return null;
    }

    const selected = this.options.filter(({ slug }) =>
      this.question.isMultipleChoice
        ? (this.value || []).includes(slug)
        : this.value === slug,
    );

    return this.question.isMultipleChoice ? selected : selected[0];
  }

  /**
   * The field's JEXL context.
   *
   * Properties:
   * - `form`: Legacy property pointing to the root form.
   * - `info.form`: The form this question is attached to.
   * - `info.formMeta`: The meta of the form this question is attached to.
   * - `info.parent.form`: The parent form if applicable.
   * - `info.parent.formMeta`: The parent form meta if applicable.
   * - `info.root.form`: The new property for the root form.
   * - `info.root.formMeta`: The new property for the root form meta.
   * - `info.case.form`: The cases' form (works for task forms and case forms).
   * - `info.case.workflow`: The cases' workflow (works for task forms and case forms).
   * - `info.case.root.form`: The _root_ cases' form (works for task forms and case forms).
   * - `info.case.root.workflow`: The _root_ cases' workflow (works for task forms and case forms).
   *
   * @property {Object} jexlContext
   */
  get jexlContext() {
    const parent = this.fieldset.field?.fieldset.form;

    return {
      ...this.document.jexlContext,
      info: {
        ...this.document.jexlContext.info,
        form: this.fieldset.form.slug,
        formMeta: this.fieldset.form.raw.meta,
        parent: parent
          ? {
              form: parent.slug,
              formMeta: parent.raw.meta,
            }
          : null,
      },
    };
  }

  /**
   * Fields that are referenced in the `calcExpression` JEXL expression
   *
   * If the value or hidden state of any of these fields change, the JEXL
   * expression needs to be re-evaluated.
   *
   * @property {Field[]} calculatedDependencies
   */
  @dependencies("question.raw.calcExpression") calculatedDependencies;

  /**
   * Fields that are referenced in the `isHidden` JEXL expression
   *
   * If the value or hidden state of any of these fields change, the JEXL
   * expression needs to be re-evaluated.
   *
   * @property {Field[]} hiddenDependencies
   */
  @dependencies("question.raw.isHidden") hiddenDependencies;

  /**
   * Fields that are referenced in the `isRequired` JEXL expression
   *
   * If the value or hidden state of any of these fields change, the JEXL
   * expression needs to be re-evaluated.
   *
   * @property {Field[]} optionalDependencies
   */
  @dependencies("question.raw.isRequired") optionalDependencies;

  /**
   * The field's hidden state
   *
   * A question is hidden if:
   * - The form question field of the fieldset is hidden
   * - All depending field (used in the expression) are hidden
   * - The evaluated `question.raw.isHidden` expression returns `true`
   *
   * @property {Boolean} hidden
   */
  @cached
  get hidden() {
    if (
      this.fieldset.field?.hidden ||
      (this.hiddenDependencies.length &&
        this.hiddenDependencies.every(fieldIsHiddenOrEmpty))
    ) {
      return true;
    }

    try {
      return this.document.jexl.evalSync(
        this.question.raw.isHidden,
        this.jexlContext,
      );
    } catch (error) {
      throw new Error(
        `Error while evaluating \`isHidden\` expression on field \`${this.pk}\`: ${error.message}`,
      );
    }
  }

  /**
   * The field's optional state
   *
   * The field is optional if:
   * - The question is of the type form or calculated float
   * - The form question field of the fieldset is hidden
   * - All depending fields (used in the expression) are hidden
   * - The evaluated `question.raw.isRequired` expression returns `false`
   * - The question type is FormQuestion or CalculatedFloatQuestion
   *
   * @property {Boolean} optional
   */
  @cached
  get optional() {
    if (
      ["FormQuestion", "CalculatedFloatQuestion"].includes(this.questionType) ||
      this.fieldset.field?.hidden ||
      (this.optionalDependencies.length &&
        this.optionalDependencies.every(fieldIsHiddenOrEmpty))
    ) {
      return true;
    }

    try {
      return !this.document.jexl.evalSync(
        this.question.raw.isRequired,
        this.jexlContext,
      );
    } catch (error) {
      throw new Error(
        `Error while evaluating \`isRequired\` expression on field \`${this.pk}\`: ${error.message}`,
      );
    }
  }

  /**
   * Task to save a field. This uses a different mutation for every answer
   * type.
   *
   * @method save
   * @return {Object} The response from the server
   */
  @restartableTask
  *save() {
    if (this.question.isCalculated) {
      return;
    }

    const type = this.answer.raw.__typename;

    const value = this.answer.serializedValue;
    const input = {
      question: this.question.slug,
      document: this.document.uuid,
    };

    if (value !== null) {
      input.value = value;
    }

    if (this.document.dataSourceContext) {
      input.dataSourceContext = JSON.stringify(this.document.dataSourceContext);
    }

    const response = yield this.apollo.mutate(
      {
        mutation: MUTATION_MAP[type],
        variables: { input },
      },
      `saveDocument${type}.answer`,
    );

    const wasNew = this.isNew;

    Object.entries(response).forEach(([key, value]) => {
      this.answer.raw[key] = value;
    });

    if (wasNew) {
      this.answer.pushIntoStore();
    }

    return response;
  }

  /**
   * The translated error messages
   *
   * @property {String[]} errors
   */
  @cached
  get errors() {
    return this._errors.map(({ type, context, value }) => {
      return this.intl.t(`caluma.form.validation.${type}`, {
        ...context,
        value,
      });
    });
  }

  /**
   * Validate the field. Every field goes through the required validation and
   * the validation for the given question type. This mutates the `errors` on
   * the field.
   *
   * @method validate
   */
  @restartableTask
  *validate() {
    const specificValidation = this[`_validate${this.questionType}`];

    assert(
      `Missing validation function for ${this.questionType}`,
      specificValidation,
    );

    const validationFns = [
      ...(!this.hidden ? [this._validateRequired] : []),
      specificValidation,
    ];

    const errors = (yield Promise.all(
      validationFns.map(async (fn) => {
        const res = await fn.call(this);

        return Array.isArray(res) ? res : [res];
      }),
    ))
      .reduce((arr, e) => [...arr, ...e], []) // flatten the array
      .filter((e) => typeof e === "object");

    this._errors = errors;
  }

  @dropTask
  *refreshAnswer() {
    const response = yield this.apollo.query(
      {
        query: refreshAnswerQuery,
        fetchPolicy: "network-only",
        variables: {
          document: this.document.uuid,
          question: this.question.slug,
        },
      },
      "allDocuments.edges",
    );

    const rawAnswer = response[0].node.answers.edges[0]?.node;

    if (rawAnswer) {
      Object.entries(rawAnswer).forEach(([key, value]) => {
        this.answer.raw[key] = value;
      });

      yield this.validate.linked().perform();
    }
  }

  /**
   * Validate the value against the regexes of the given format validators.
   *
   * @method _validateFormatValidators
   * @return {Array<Boolean|Object>} An array of error objects or `true`
   * @private
   */
  _validateFormatValidators() {
    const validators =
      this.question.raw.formatValidators?.edges.map((edge) => edge.node) ?? [];
    const value = this.answer.value;

    if (isEmpty(value)) {
      // empty values should not be validated since they are handled by the
      // requiredness validation
      return validators.map(() => true);
    }

    return validators.map((validator) => {
      return (
        new RegExp(validator.regex).test(value) || {
          type: "format",
          context: { errorMsg: validator.errorMsg },
          value,
        }
      );
    });
  }

  /**
   * Method to validate if a question is required or not.
   *
   * @method _validateRequired
   * @return {Boolean|Object} Returns an object if invalid or true if valid
   * @private
   */
  _validateRequired() {
    return (
      this.optional ||
      validate("presence", this.answer.value, { presence: true })
    );
  }

  /**
   * Method to validate a text question. This checks if the value longer than
   * predefined by the question.
   *
   * @method _validateTextQuestion
   * @return {Array<Boolean|Object>} An array of error objects or `true`
   * @private
   */
  _validateTextQuestion() {
    return [
      ...this._validateFormatValidators(),
      validate("length", this.answer.value, {
        min: this.question.raw.textMinLength || 0,
        max: this.question.raw.textMaxLength || Number.POSITIVE_INFINITY,
      }),
    ];
  }

  /**
   * Method to validate a textarea question. This checks if the value longer
   * than predefined by the question.
   *
   * @method _validateTextareaQuestion
   * @return {Array<Boolean|Object>} An array of error objects or `true`
   * @private
   */
  _validateTextareaQuestion() {
    return [
      ...this._validateFormatValidators(),
      validate("length", this.answer.value, {
        min: this.question.raw.textareaMinLength || 0,
        max: this.question.raw.textareaMaxLength || Number.POSITIVE_INFINITY,
      }),
    ];
  }

  /**
   * Method to validate an integer question. This checks if the value is bigger
   * or less than the options provided by the question.
   *
   * @method _validateIntegerQuestion
   * @return {Boolean|Object} Returns an object if invalid or true if valid
   * @private
   */
  _validateIntegerQuestion() {
    return validate("number", this.answer.value, {
      integer: true,
      gte: this.question.raw.integerMinValue || Number.NEGATIVE_INFINITY,
      lte: this.question.raw.integerMaxValue || Number.POSITIVE_INFINITY,
    });
  }

  /**
   * Method to validate a float question. This checks if the value is bigger or
   * less than the options provided by the question.
   *
   * @method _validateFloatQuestion
   * @return {Boolean|Object} Returns an object if invalid or true if valid
   * @private
   */
  _validateFloatQuestion() {
    return validate("number", this.answer.value, {
      gte: this.question.raw.floatMinValue || Number.NEGATIVE_INFINITY,
      lte: this.question.raw.floatMaxValue || Number.POSITIVE_INFINITY,
    });
  }

  /**
   * Method to validate a radio question. This checks if the value is included
   * in the provided options of the question.
   *
   * @method _validateChoiceQuestion
   * @return {Boolean|Object} Returns an object if invalid or true if valid
   * @private
   */
  _validateChoiceQuestion() {
    return this._validateOption(this.answer.value, true);
  }

  /**
   * Method to validate a checkbox question. This checks if the all of the
   * values are included in the provided options of the question.
   *
   * @method _validateMultipleChoiceQuestion
   * @return {Boolean|Object} Returns an object if invalid or true if valid
   * @private
   */
  _validateMultipleChoiceQuestion() {
    return this.answer.value
      ? this.answer.value.map((value) => this._validateOption(value))
      : true;
  }

  /**
   * Method to validate a radio question. This checks if the value is included
   * in the provided options of the question.
   *
   * @method _validateChoiceQuestion
   * @return {Promise<Boolean|Object>} A promise which resolves into an object if invalid or true if valid
   * @private
   */
  async _validateDynamicChoiceQuestion() {
    await this.question.dynamicOptions.retry();

    return this._validateOption(this.answer.value, true);
  }

  /**
   * Method to validate a checkbox question. This checks if the all of the
   * values are included in the provided options of the question.
   *
   * @method _validateMultipleChoiceQuestion
   * @return {Promise<Boolean[]|Object[]|Mixed[]>} A promise which resolves into an array of objects if invalid or true if valid
   * @private
   */
  async _validateDynamicMultipleChoiceQuestion() {
    const value = this.answer.value;

    if (!value) {
      return true;
    }

    await this.question.dynamicOptions.retry();

    return this.answer.value
      ? value.map((value) => this._validateOption(value))
      : true;
  }

  _validateOption(value, allowBlank = false) {
    const label = Array.isArray(this.selected)
      ? this.selected.find((selected) => selected.slug === value)?.label
      : this.selected?.label;

    return validate("inclusion", value, {
      in: (this.options || [])
        .filter((option) => !option.disabled)
        .map(({ slug }) => slug),
      allowBlank,
      label: label ?? value,
    });
  }

  /**
   * Dummy method for the validation of file uploads.
   *
   * @method _validateFilesQuestion
   * @return {Boolean} Always returns true
   * @private
   */
  _validateFilesQuestion() {
    return true;
  }

  /**
   * Method to validate a date question.
   *
   * @method _validateDateQuestion
   * @return {Object[]|Boolean[]|Mixed[]} Returns per value an object if invalid or true if valid
   * @private
   */
  _validateDateQuestion() {
    return validate("date", this.answer.value, {
      allowBlank: true,
    });
  }

  /**
   * Dummy method for the validation of table fields
   *
   * @method _validateTableQuestion
   * @return {Promise<Boolean|Object>} A promise which resolves into an object if invalid or true if valid
   * @private
   */
  async _validateTableQuestion() {
    if (!this.value) return true;

    const rowValidations = await Promise.all(
      this.value.map(async (row) => {
        const validFields = await Promise.all(
          row.fields.map(async (field) => {
            await field.validate.perform();

            return field.isValid;
          }),
        );

        return validFields.every(Boolean);
      }),
    );

    return (
      rowValidations.every(Boolean) || {
        type: "table",
        context: {},
        value: null,
      }
    );
  }

  /**
   * Dummy method for the validation of static fields
   *
   * @method _validateStaticQuestion
   * @return {Boolean} Always returns true
   * @private
   */
  _validateStaticQuestion() {
    return true;
  }

  /**
   * Dummy method for the validation of form fields
   *
   * @method _validateFormQuestion
   * @return {Boolean} Always returns true
   * @private
   */
  _validateFormQuestion() {
    return true;
  }

  /**
   * Dummy method for the validation of calculated float fields
   *
   * @method _validateCalculatedFloatQuestion
   * @return {Boolean} Always returns true
   * @private
   */
  _validateCalculatedFloatQuestion() {
    return true;
  }

  /**
   * Dummy method for the validation of work item button fields
   *
   * @method _validateActionButtonQuestion
   * @return {Boolean} Always returns true
   * @private
   */
  _validateActionButtonQuestion() {
    return true;
  }
}
