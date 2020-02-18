import Base from "ember-caluma/lib/base";
import { computed, getWithDefault, defineProperty } from "@ember/object";
import { equal, not, reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { camelize } from "@ember/string";
import { task } from "ember-concurrency";
import { all, resolve } from "rsvp";
import { validate } from "ember-validators";
import { queryManager } from "ember-apollo-client";

import { decodeId } from "ember-caluma/helpers/decode-id";

import saveDocumentFloatAnswerMutation from "ember-caluma/gql/mutations/save-document-float-answer";
import saveDocumentIntegerAnswerMutation from "ember-caluma/gql/mutations/save-document-integer-answer";
import saveDocumentStringAnswerMutation from "ember-caluma/gql/mutations/save-document-string-answer";
import saveDocumentListAnswerMutation from "ember-caluma/gql/mutations/save-document-list-answer";
import saveDocumentFileAnswerMutation from "ember-caluma/gql/mutations/save-document-file-answer";
import saveDocumentDateAnswerMutation from "ember-caluma/gql/mutations/save-document-date-answer";
import saveDocumentTableAnswerMutation from "ember-caluma/gql/mutations/save-document-table-answer";
import getDocumentUsedDynamicOptionsQuery from "ember-caluma/gql/queries/get-document-used-dynamic-options";
import { getAST, getTransforms } from "ember-caluma/utils/jexl";

const TYPE_MAP = {
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
  FileQuestion: "FileAnswer",
  StaticQuestion: null,
  DateQuestion: "DateAnswer",
};

const fieldIsHidden = (field) => {
  return (
    field.hidden ||
    (field.question.__typename !== "TableQuestion" &&
      (field.answer.value === null || field.answer.value === undefined))
  );
};

const getDependenciesFromJexl = (expression) => {
  return [
    ...new Set(
      getTransforms(getAST(expression))
        .filter((transform) => transform.name === "answer")
        .map((transform) => transform.subject.value)
    ),
  ];
};

/**
 * An object which represents a combination of a question and an answer.
 *
 * @class Field
 */
export default Base.extend({
  saveDocumentFloatAnswerMutation,
  saveDocumentIntegerAnswerMutation,
  saveDocumentStringAnswerMutation,
  saveDocumentListAnswerMutation,
  saveDocumentFileAnswerMutation,
  saveDocumentDateAnswerMutation,
  saveDocumentTableAnswerMutation,

  intl: service(),
  calumaStore: service(),
  validator: service(),

  apollo: queryManager(),

  init() {
    assert("A document must be passed", this.document);

    defineProperty(this, "pk", {
      writable: false,
      value: `${this.document.pk}:Question:${this.raw.question.slug}`,
    });

    this._super(...arguments);

    this._createQuestion();
    this._createAnswer();

    this.set("_errors", []);
  },

  willDestroy() {
    this._super(...arguments);

    if (this.answer) {
      this.answer.destroy();
    }
  },

  _createQuestion() {
    const question =
      this.calumaStore.find(`Question:${this.raw.question.slug}`) ||
      getOwner(this)
        .factoryFor("caluma-model:question")
        .create({ raw: this.raw.question });

    if (question.isDynamic) {
      question.loadDynamicOptions.perform();
    }

    this.set("question", question);
  },

  _createAnswer() {
    const AnswerFactory = getOwner(this).factoryFor("caluma-model:answer");
    let answer;

    // no answer passed, create an empty one
    if (!this.raw.answer) {
      const answerType = TYPE_MAP[this.raw.question.__typename];

      // static questions don't have an answer
      if (!answerType) {
        return;
      }

      answer = AnswerFactory.create({
        raw: {
          __typename: answerType,
          question: { slug: this.raw.question.slug },
          [camelize(answerType.replace(/Answer$/, "Value"))]: null,
        },
        field: this,
      });
    } else {
      answer =
        this.calumaStore.find(`Answer:${decodeId(this.raw.answer.id)}`) ||
        AnswerFactory.create({ raw: this.raw.answer, field: this });
    }

    this.set("answer", answer);
  },

  /**
   * The question to this field
   *
   * @property {Question} question
   * @accessor
   */
  question: null,

  /**
   * The answer to this field. It is possible for this to be `null` if the
   * question is of the static question type.
   *
   * @property {Answer} answer
   * @accessor
   */
  answer: null,

  /**
   * Whether the field is valid.
   *
   * @property {Boolean} isValid
   * @accessor
   */
  isValid: equal("errors.length", 0),

  /**
   * Whether the field is invalid.
   *
   * @property {Boolean} isInvalid
   * @accessor
   */
  isInvalid: not("isValid"),

  /**
   * Whether the field is new (never saved to the backend service or empty)
   *
   * @property {Boolean} isNew
   * @accessor
   */
  isNew: computed("answer.isNew", function () {
    return !this.answer || this.answer.isNew;
  }),

  /**
   * The type of the question
   *
   * @property {String} questionType
   * @accessor
   */
  questionType: reads("question.__typename"),

  /**
   * The document this field belongs to
   *
   * @property {Document} document
   * @accessor
   */
  document: reads("fieldset.document"),

  /**
   * The value of the field
   *
   * @property {*} value
   * @accessor
   */
  value: reads("answer.value"),

  /**
   * Fetch all formerly used dynamic options for this question. This will be
   * taken from the apollo cache if possible.
   *
   * @method _fetchUsedDynamicOptions.perform
   * @return {Object[]} Formerly used dynamic options
   * @private
   */
  _fetchUsedDynamicOptions: task(function* () {
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
      "allUsedDynamicOptions.edges"
    );

    return edges.map(({ node: { slug, label } }) => ({
      slug,
      label,
    }));
  }),

  /**
   * The formerly used dynamic options for this question.
   *
   * @property {Object[]} usedDynamicOptions
   * @accessor
   *
   */
  usedDynamicOptions: reads("_fetchUsedDynamicOptions.lastSuccessful.value"),

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
   * be disabled, if it is an old value used in a dynamic question.
   *
   * @property {Null|Object[]} options
   * @accessor
   */
  options: computed(
    "value",
    "question.options.[]",
    "usedDynamicOptions.[]",
    function () {
      if (!this.question.isChoice && !this.question.isMultipleChoice) {
        return null;
      }

      const selected =
        (this.question.isMultipleChoice ? this.value : [this.value]) || [];

      const options = this.question.options.map((option) => ({
        ...option,
        disabled: false,
      }));

      const hasInvalidSelected = !selected.every((slug) =>
        options.find((option) => option.slug === slug)
      );

      if (this.question.isDynamic && hasInvalidSelected) {
        if (!this._fetchUsedDynamicOptions.lastSuccessful) {
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
  ),

  /**
   * The currently selected option. This property is only used for choice
   * questions. It can either return null if no value is selected yet, an
   * object for single choices or an array of objects for multiple choices.
   *
   * @property {Null|Object|Object[]} selected
   * @accessor
   */
  selected: computed("value", "options.@each.slug", function () {
    if (!this.question.isChoice && !this.question.isMultipleChoice) {
      return null;
    }

    const selected = this.options.filter(({ slug }) =>
      this.question.isMultipleChoice
        ? (this.value || []).includes(slug)
        : this.value === slug
    );

    return this.question.isMultipleChoice ? selected : selected[0];
  }),

  /**
   * Fields that are referenced in the `isHidden` JEXL expression
   *
   * If the value or hidden state of any of these fields change, the JEXL
   * expression needs to be re-evaluated.
   *
   * @property {Field[]} hiddenDependencies
   * @accessor
   */
  hiddenDependencies: computed(
    "document.fields.[]",
    "question.isHidden",
    function () {
      return getDependenciesFromJexl(this.question.isHidden).map((slug) => {
        const f = this.document.findField(slug);

        assert(
          `Field for question \`${slug}\` was not found in this document. Please check the \`isHidden\` jexl expression: \`${this.question.isHidden}\`.`,
          f
        );

        return f;
      });
    }
  ),

  /**
   * Fields that are referenced in the `isRequired` JEXL expression
   *
   * If the value or hidden state of any of these fields change, the JEXL
   * expression needs to be re-evaluated.
   *
   * @property {Field[]} optionalDependencies
   * @accessor
   */
  optionalDependencies: computed(
    "document.fields.[]",
    "question.isRequired",
    function () {
      return getDependenciesFromJexl(this.question.isRequired).map((slug) => {
        const f = this.document.findField(slug);

        assert(
          `Field for question \`${slug}\` was not found in this document. Please check the \`isRequired\` jexl expression: \`${this.question.isRequired}\`.`,
          f
        );

        return f;
      });
    }
  ),

  /**
   * The field's hidden state
   *
   * A question is hidden if:
   * - The form question field of the fieldset is hidden
   * - All depending field (used in the expression) are hidden
   * - The evaluated `question.isHidden` expression returns `true`
   *
   * @property {Boolean} hidden
   */
  hidden: computed(
    "fieldset.field.hidden",
    "hiddenDependencies.@each.{hidden,value}",
    function () {
      return (
        getWithDefault(this, "fieldset.field.hidden", false) ||
        (this.hiddenDependencies.length &&
          this.hiddenDependencies.every(fieldIsHidden)) ||
        this.document.jexl.evalSync(
          this.question.isHidden,
          this.document.jexlContext
        )
      );
    }
  ),

  /**
   * The field's optional state
   *
   * The field is optional if:
   * - The form question field of the fieldset is hidden
   * - All depending field (used in the expression) are hidden
   * - The evaluated `question.isRequired` expression returns `false`
   *
   * @property {Boolean} optional
   */
  optional: computed(
    "fieldset.field.hidden",
    "optionalDependencies.@each.{hidden,value}",
    function () {
      return (
        getWithDefault(this, "fieldset.field.hidden", false) ||
        (this.optionalDependencies.length &&
          this.optionalDependencies.every(fieldIsHidden)) ||
        !this.document.jexl.evalSync(
          this.question.isRequired,
          this.document.jexlContext
        )
      );
    }
  ),

  /**
   * Task to save a field. This uses a different mutation for every answer
   * type.
   *
   * @method save.perform
   * @return {Object} The response from the server
   */
  save: task(function* () {
    const type = this.get("answer.__typename");

    const response = yield this.apollo.mutate(
      {
        mutation: this.get(`saveDocument${type}Mutation`),
        variables: {
          input: {
            question: this.question.slug,
            document: this.document.uuid,
            ...(this.answer.serializedValue !== null
              ? { value: this.answer.serializedValue }
              : {}),
          },
        },
      },
      `saveDocument${type}.answer`
    );

    if (this.isNew) {
      // if the answer was new we need to set a pk an push the answer to the
      // store
      this.answer.set("pk", `Answer:${decodeId(response.id)}`);

      this.calumaStore.push(this.answer);
    }

    // update the existing answer
    this.answer.setProperties(response);

    this.set("raw.answer", response);
    this.set("answer.raw", response);

    return response;
  }).restartable(),

  /**
   * The error messages on this field.
   *
   * @property {String[]} errors
   * @accessor
   */
  errors: computed("_errors.[]", function () {
    return this._errors.map(({ type, context, value }) => {
      return this.intl.t(
        `caluma.form.validation.${type}`,
        Object.assign({}, context, { value })
      );
    });
  }),

  /**
   * Validate the field. Every field goes through the required validation and
   * the validation for the given question type. This mutates the `errors` on
   * the field.
   *
   * @method validate.perform
   */
  validate: task(function* () {
    const specificValidation = this.get(`_validate${this.question.__typename}`);
    assert(
      "Missing validation function for " + this.question.__typename,
      specificValidation
    );

    const validationFns = [
      ...(!this.hidden ? [this._validateRequired] : []),
      specificValidation,
    ];

    const errors = (yield all(
      validationFns.map(async (fn) => {
        const res = await fn.call(this);

        return Array.isArray(res) ? res : [res];
      })
    ))
      .reduce((arr, e) => [...arr, ...e], []) // flatten the array
      .filter((e) => typeof e === "object");

    this.set("_errors", errors);
  }).restartable(),

  /**
   * Method to validate if a question is required or not.
   *
   * @method _validateRequired
   * @return {RSVP.Promise} Returns an promise which resolves into an object if invalid or true if valid
   * @internal
   */
  async _validateRequired() {
    return (
      this.optional ||
      validate("presence", this.get("answer.value"), { presence: true })
    );
  },

  /**
   * Method to validate a text question. This checks if the value longer than
   * predefined by the question.
   *
   * @method _validateTextQuestion
   * @return {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  async _validateTextQuestion() {
    return [
      ...(await this.validator.validate(
        this.get("answer.value"),
        this.getWithDefault("question.meta.formatValidators", [])
      )),
      validate("length", this.get("answer.value"), {
        min: this.get("question.textMinLength") || 0,
        max: this.get("question.textMaxLength") || Number.POSITIVE_INFINITY,
      }),
    ];
  },

  /**
   * Method to validate a textarea question. This checks if the value longer
   * than predefined by the question.
   *
   * @method _validateTextareaQuestion
   * @return {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  async _validateTextareaQuestion() {
    return [
      ...(await this.validator.validate(
        this.get("answer.value"),
        this.getWithDefault("question.meta.formatValidators", [])
      )),
      validate("length", this.get("answer.value"), {
        min: this.get("question.textareaMinLength") || 0,
        max: this.get("question.textareaMaxLength") || Number.POSITIVE_INFINITY,
      }),
    ];
  },

  /**
   * Method to validate an integer question. This checks if the value is bigger
   * or less than the options provided by the question.
   *
   * @method _validateIntegerQuestion
   * @return {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  _validateIntegerQuestion() {
    return validate("number", this.get("answer.value"), {
      integer: true,
      gte: this.get("question.integerMinValue") || Number.NEGATIVE_INFINITY,
      lte: this.get("question.integerMaxValue") || Number.POSITIVE_INFINITY,
    });
  },

  /**
   * Method to validate a float question. This checks if the value is bigger or
   * less than the options provided by the question.
   *
   * @method _validateFloatQuestion
   * @return {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  _validateFloatQuestion() {
    return validate("number", this.get("answer.value"), {
      gte: this.get("question.floatMinValue") || Number.NEGATIVE_INFINITY,
      lte: this.get("question.floatMaxValue") || Number.POSITIVE_INFINITY,
    });
  },

  /**
   * Method to validate a radio question. This checks if the value is included
   * in the provided options of the question.
   *
   * @method _validateChoiceQuestion
   * @return {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  _validateChoiceQuestion() {
    return validate("inclusion", this.get("answer.value"), {
      allowBlank: true,
      in: (this.options || []).map(({ slug }) => slug),
    });
  },

  /**
   * Method to validate a checkbox question. This checks if the all of the
   * values are included in the provided options of the question.
   *
   * @method _validateMultipleChoiceQuestion
   * @return {Object[]|Boolean[]|Mixed[]} Returns per value an object if invalid or true if valid
   * @internal
   */
  _validateMultipleChoiceQuestion() {
    const value = this.get("answer.value");
    if (!value) {
      return true;
    }
    return value.map((value) =>
      validate("inclusion", value, {
        in: (this.options || []).map(({ slug }) => slug),
      })
    );
  },

  /**
   * Method to validate a radio question. This checks if the value is included
   * in the provided options of the question.
   *
   * @method _validateChoiceQuestion
   * @return {Object|Boolean} Returns an object if invalid or true if valid
   * @internal
   */
  async _validateDynamicChoiceQuestion() {
    await this.question.loadDynamicOptions.perform();

    return validate("inclusion", this.get("answer.value"), {
      in: (this.options || []).map(({ slug }) => slug),
    });
  },

  /**
   * Method to validate a checkbox question. This checks if the all of the
   * values are included in the provided options of the question.
   *
   * @method _validateMultipleChoiceQuestion
   * @return {Object[]|Boolean[]|Mixed[]} Returns per value an object if invalid or true if valid
   * @internal
   */
  async _validateDynamicMultipleChoiceQuestion() {
    const value = this.get("answer.value");

    if (!value) {
      return true;
    }

    await this.question.loadDynamicOptions.perform();

    return value.map((value) => {
      return validate("inclusion", value, {
        in: (this.options || []).map(({ slug }) => slug),
      });
    });
  },

  /**
   * Dummy method for the validation of file uploads.
   *
   * @method _validateFileQuestion
   * @return {RSVP.Promise}
   * @private
   */
  _validateFileQuestion() {
    return resolve(true);
  },

  /**
   * Method to validate a date question.
   *
   * @method _validateDateQuestion
   * @return {Object[]|Boolean[]|Mixed[]} Returns per value an object if invalid or true if valid
   * @internal
   */
  _validateDateQuestion() {
    return validate("date", this.get("answer.value"), {
      allowBlank: true,
    });
  },

  /**
   * Dummy method for the validation of table fields
   *
   * @method _validateTableQuestion
   * @return {RSVP.Promise}
   * @private
   */
  async _validateTableQuestion() {
    if (!this.value) return true;

    const rowValidations = await all(
      this.value.map(async (row) => {
        const validFields = await all(
          row.fields.map(async (field) => {
            await field.validate.perform();

            return field.isValid;
          })
        );

        return validFields.every(Boolean);
      })
    );

    return (
      rowValidations.every(Boolean) || {
        type: "table",
        context: {},
        value: null,
      }
    );
  },

  /**
   * Dummy method for the validation of static fields
   *
   * @method _validateStaticQuestion
   * @return {RSVP.Promise}
   * @private
   */
  _validateStaticQuestion() {
    return resolve(true);
  },

  /**
   * Dummy method for the validation of form fields
   *
   * @method _validateFormQuestion
   * @return {RSVP.Promise}
   * @private
   */
  _validateFormQuestion() {
    return resolve(true);
  },
});
