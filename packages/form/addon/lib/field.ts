import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { associateDestroyableChild } from "@ember/destroyable";
import { inject as service } from "@ember/service";
import { camelize } from "@ember/string";
import { tracked } from "@glimmer/tracking";
import { queryManager, ApolloQueryManager } from "ember-apollo-client";
import {
  restartableTask,
  lastValue,
  dropTask,
  TaskGenerator,
} from "ember-concurrency";
import { taskFor } from "ember-concurrency-ts";
import IntlService from "ember-intl/services/intl";
import { validate, ValidationError, ValidationResult } from "ember-validators";
import { DocumentNode } from "graphql";
import isEqual from "lodash.isequal";
import { cached } from "tracked-toolbox";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import ValidatorService from "@projectcaluma/ember-core/services/validator";
import saveDocumentDateAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-date-answer.graphql";
import saveDocumentFileAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-file-answer.graphql";
import saveDocumentFloatAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-float-answer.graphql";
import saveDocumentIntegerAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-integer-answer.graphql";
import saveDocumentListAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-list-answer.graphql";
import saveDocumentStringAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-string-answer.graphql";
import saveDocumentTableAnswerMutation from "@projectcaluma/ember-form/gql/mutations/save-document-table-answer.graphql";
import getDocumentUsedDynamicOptionsQuery from "@projectcaluma/ember-form/gql/queries/document-used-dynamic-options.graphql";
import Answer from "@projectcaluma/ember-form/lib/answer";
import Base from "@projectcaluma/ember-form/lib/base";
import dependencies from "@projectcaluma/ember-form/lib/dependencies";
import Document from "@projectcaluma/ember-form/lib/document";
import Fieldset from "@projectcaluma/ember-form/lib/fieldset";
import Question from "@projectcaluma/ember-form/lib/question";

export const TYPE_MAP: Record<string, string | null> = {
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

const MUTATION_MAP: Record<string, DocumentNode> = {
  FloatAnswer: saveDocumentFloatAnswerMutation,
  IntegerAnswer: saveDocumentIntegerAnswerMutation,
  StringAnswer: saveDocumentStringAnswerMutation,
  ListAnswer: saveDocumentListAnswerMutation,
  FileAnswer: saveDocumentFileAnswerMutation,
  DateAnswer: saveDocumentDateAnswerMutation,
  TableAnswer: saveDocumentTableAnswerMutation,
};

const fieldIsHiddenOrEmpty = (field: Field): boolean => {
  return (
    field.hidden ||
    (!field.question.isTable &&
      (field.answer?.value === null || field.answer?.value === undefined))
  );
};

type RawField = { question: RawQuestion; answer?: RawAnswer };

/**
 * An object which represents a combination of a question and an answer.
 *
 * @class Field
 */
export default class Field extends Base {
  @service declare intl: IntlService;
  @service declare validator: ValidatorService;

  @queryManager declare apollo: ApolloQueryManager;

  constructor({
    fieldset,
    raw,
    owner,
  }: {
    fieldset: Fieldset;
    raw: RawField;
    owner: unknown;
  }) {
    super({ owner });

    this.raw = raw;
    this.fieldset = fieldset;

    this.pushIntoStore();

    this.question = this._createQuestion();
    this.answer = this._createAnswer();
  }

  _createQuestion(): Question {
    const owner = getOwner(this);
    const klass = owner.factoryFor("caluma-model:question")
      .class as typeof Question;

    const existing = this.calumaStore.find(
      `Question:${this.raw.question.slug}`
    ) as Question | null;

    const question =
      existing ??
      new klass({
        raw: this.raw.question,
        owner,
      });

    if (question.isDynamic) {
      void taskFor(question.loadDynamicOptions.bind(question)).perform();
    }

    return question;
  }

  _createAnswer(): Answer | undefined {
    const owner = getOwner(this);
    const klass = owner.factoryFor("caluma-model:answer")
      .class as typeof Answer;

    // no answer passed, create an empty one
    if (!this.raw.answer) {
      const answerType = TYPE_MAP[this.raw.question.__typename];

      // static and form questions don't have an answer
      if (!answerType) {
        return;
      }

      return associateDestroyableChild(
        this,
        new klass({
          raw: {
            __typename: answerType,
            question: { slug: this.raw.question.slug },
            [camelize(answerType.replace(/Answer$/, "Value"))]: null,
          },
          field: this,
          owner,
        })
      );
    }

    const existing = this.calumaStore.find(
      `Answer:${decodeId(this.raw.answer.id as string)}`
    ) as Answer | null;

    return associateDestroyableChild(
      this,
      existing ?? new klass({ raw: this.raw.answer, field: this, owner })
    );
  }

  /**
   * The raw data of the field
   */
  readonly raw: RawField;

  /**
   * The fieldset this field belongs to
   */
  readonly fieldset: Fieldset;

  /**
   * The question to this field
   */
  readonly question: Question;

  /**
   * The answer to this field. It is possible for this to be `undefined` if the
   * question is of the static or form question type.
   */
  readonly answer?: Answer;

  /**
   * The raw error objects which are later translated to readable messages.
   *
   * @private
   */
  @tracked private _errors: ValidationError[] = [];

  /**
   * The primary key of the field. Consists of the document and question primary
   * keys.
   */
  @cached
  get pk(): string {
    return `${this.document.pk}:Question:${this.raw.question.slug}`;
  }

  /**
   * Whether the field is valid.
   */
  get isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * Whether the field is invalid.
   */
  get isInvalid(): boolean {
    return !this.isValid;
  }

  /**
   * Whether the field is new (never saved to the backend service or empty)
   */
  get isNew(): boolean {
    return !this.answer || this.answer.isNew;
  }

  /**
   * Whether the field has the defined default answer of the question as value.
   */
  get isDefault(): boolean {
    if (!this.value || !this.question.defaultValue) return false;

    const value = this.question.isTable
      ? (this.value as Document[]).map((document) => document.flatAnswerMap)
      : this.value;

    return isEqual(value, this.question.defaultValue);
  }

  /**
   * Whether the field is dirty. This will be true, if there is a value on the
   * answer which differs from the default value of the question.
   */
  get isDirty(): boolean {
    if (this.question.isCalculated || this.isDefault) {
      return false;
    }

    return (
      Boolean(taskFor(this.validate.bind(this)).lastSuccessful) || !this.isNew
    );
  }

  /**
   * The type of the question
   */
  get questionType(): string {
    return this.question.raw.__typename;
  }

  /**
   * The document this field belongs to
   */
  get document(): Document {
    return this.fieldset.document;
  }

  /**
   * The value of the field
   */
  get value(): AnswerValue | unknown {
    if (this.question.isCalculated) {
      return this.calculatedValue;
    }

    return this.answer?.value;
  }

  /**
   * The computed value of a calculated float question
   */
  @cached
  get calculatedValue(): unknown {
    if (
      !this.question.isCalculated ||
      !this.calculatedDependencies.every((field) => !field.hidden)
    ) {
      return null;
    }

    try {
      return this.document.jexl.evalSync(
        this.question.raw.calcExpression as string,
        this.jexlContext
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
  *_fetchUsedDynamicOptions(): TaskGenerator<DynamicOption[]> {
    if (!this.question.isDynamic) return [];

    const edges: { node: DynamicOption }[] = yield this.apollo.query(
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
  }

  /**
   * The formerly used dynamic options for this question.
   */
  @lastValue("_fetchUsedDynamicOptions") usedDynamicOptions: DynamicOption[] =
    [];

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
   */
  @cached
  get options(): Option[] {
    if (!this.question.isChoice && !this.question.isMultipleChoice) {
      return [];
    }

    const selected =
      ((this.question.isMultipleChoice
        ? this.value
        : [this.value]) as string[]) || [];

    const options = this.question.options.filter(
      (option) => !option.disabled || selected.includes(option.slug)
    );

    const hasUnknownValue = !selected.every((slug) =>
      options.find((option) => option.slug === slug)
    );

    if (this.question.isDynamic && hasUnknownValue) {
      if (!taskFor(this._fetchUsedDynamicOptions.bind(this)).lastSuccessful) {
        // Fetch used dynamic options if not done yet
        void taskFor(this._fetchUsedDynamicOptions.bind(this)).perform();
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
   */
  get selected(): Option | Option[] | null {
    if (!this.question.isChoice && !this.question.isMultipleChoice) {
      return null;
    }

    const selected = this.options.filter(({ slug }) =>
      this.question.isMultipleChoice
        ? ((this.value ?? []) as string[]).includes(slug)
        : this.value === slug
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
   */
  get jexlContext(): FieldJexlContext {
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
   */
  @dependencies("question.raw.calcExpression") calculatedDependencies: Field[] =
    [];

  /**
   * Fields that are referenced in the `isHidden` JEXL expression
   *
   * If the value or hidden state of any of these fields change, the JEXL
   * expression needs to be re-evaluated.
   */
  @dependencies("question.raw.isHidden") hiddenDependencies: Field[] = [];

  /**
   * Fields that are referenced in the `isRequired` JEXL expression
   *
   * If the value or hidden state of any of these fields change, the JEXL
   * expression needs to be re-evaluated.
   */
  @dependencies("question.raw.isRequired") optionalDependencies: Field[] = [];

  /**
   * The field's hidden state
   *
   * A question is hidden if:
   * - The form question field of the fieldset is hidden
   * - All depending field (used in the expression) are hidden
   * - The evaluated `question.raw.isHidden` expression returns `true`
   */
  @cached
  get hidden(): boolean | undefined {
    if (
      this.fieldset.field?.hidden ||
      (this.hiddenDependencies.length &&
        this.hiddenDependencies.every(fieldIsHiddenOrEmpty))
    ) {
      return true;
    }

    try {
      return Boolean(
        this.document.jexl.evalSync(
          this.question.raw.isHidden,
          this.jexlContext
        )
      );
    } catch (error) {
      const msg = error.message as string;

      throw new Error(
        `Error while evaluating \`isHidden\` expression on field \`${this.pk}\`: ${msg}`
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
   */
  @cached
  get optional(): boolean | undefined {
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
        this.jexlContext
      );
    } catch (error) {
      const msg = error.message as string;

      throw new Error(
        `Error while evaluating \`isRequired\` expression on field \`${this.pk}\`: ${msg}`
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
  *save(): TaskGenerator<Record<string, unknown> | undefined> {
    if (!this.answer) return;

    const type = this.answer.raw.__typename;

    const response: RawAnswer = yield this.apollo.mutate(
      {
        mutation: MUTATION_MAP[type],
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

    const wasNew = this.isNew;

    if (this.answer.raw) {
      Object.entries(response).forEach(([key, value]) => {
        (this.answer as Answer).raw[key] = value;
      });
    }

    if (wasNew) {
      this.answer.pushIntoStore();
    }

    return response;
  }

  /**
   * The translated error messages
   */
  @cached
  get errors(): string[] {
    return this._errors.map(({ type, context, value }) => {
      return this.intl.t(
        `caluma.form.validation.${type}`,
        Object.assign({}, context, { value })
      );
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
  *validate(): TaskGenerator<void> {
    type ValidationMethodName =
      | "_validateTextQuestion"
      | "_validateTextareaQuestion"
      | "_validateIntegerQuestion"
      | "_validateFloatQuestion"
      | "_validateChoiceQuestion"
      | "_validateMultipleChoiceQuestion"
      | "_validateDynamicChoiceQuestion"
      | "_validateDynamicMultipleChoiceQuestion"
      | "_validateFileQuestion"
      | "_validateDateQuestion"
      | "_validateTableQuestion"
      | "_validateStaticQuestion"
      | "_validateFormQuestion"
      | "_validateCalculatedFloatQuestion"
      | "_validateActionButtonQuestion";

    const specificValidation =
      this[`_validate${this.questionType}` as ValidationMethodName].bind(this);

    assert(
      `Missing validation function for ${this.questionType}`,
      specificValidation
    );

    const validationFns = [
      ...(!this.hidden ? [this._validateRequired.bind(this)] : []),
      specificValidation,
    ];

    const errors = (yield Promise.all(validationFns.map((fn) => fn())))
      .flat()
      .filter((e: ValidationResult) => typeof e === "object");

    this._errors = errors;
  }

  /**
   * Method to validate if a question is required or not.
   */
  private _validateRequired(): ValidationResult {
    return (
      this.optional ||
      validate("presence", this.answer?.value, { presence: true })
    );
  }

  /**
   * Method to validate a text question. This checks if the value longer than
   * predefined by the question.
   */
  private async _validateTextQuestion(): Promise<ValidationResult[]> {
    return [
      ...(await this.validator.validate(
        this.answer?.value,
        this.question.raw.meta.formatValidators ?? []
      )),
      validate("length", this.answer?.value, {
        min: this.question.raw.textMinLength || 0,
        max: this.question.raw.textMaxLength || Number.POSITIVE_INFINITY,
      }),
    ];
  }

  /**
   * Method to validate a textarea question. This checks if the value longer
   * than predefined by the question.
   */
  private async _validateTextareaQuestion(): Promise<ValidationResult[]> {
    return [
      ...(await this.validator.validate(
        this.answer?.value,
        this.question.raw.meta.formatValidators ?? []
      )),
      validate("length", this.answer?.value, {
        min: this.question.raw.textareaMinLength || 0,
        max: this.question.raw.textareaMaxLength || Number.POSITIVE_INFINITY,
      }),
    ];
  }

  /**
   * Method to validate an integer question. This checks if the value is bigger
   * or less than the options provided by the question.
   *
   * @private
   */
  private _validateIntegerQuestion(): ValidationResult {
    return validate("number", this.answer?.value, {
      integer: true,
      gte: this.question.raw.integerMinValue || Number.NEGATIVE_INFINITY,
      lte: this.question.raw.integerMaxValue || Number.POSITIVE_INFINITY,
    });
  }

  /**
   * Method to validate a float question. This checks if the value is bigger or
   * less than the options provided by the question.
   */
  private _validateFloatQuestion(): ValidationResult {
    return validate("number", this.answer?.value, {
      gte: this.question.raw.floatMinValue || Number.NEGATIVE_INFINITY,
      lte: this.question.raw.floatMaxValue || Number.POSITIVE_INFINITY,
    });
  }

  /**
   * Method to validate a radio question. This checks if the value is included
   * in the provided options of the question.
   */
  private _validateChoiceQuestion(): ValidationResult {
    return validate("inclusion", this.answer?.value, {
      allowBlank: true,
      in: (this.options || []).map(({ slug }) => slug),
    });
  }

  /**
   * Method to validate a checkbox question. This checks if the all of the
   * values are included in the provided options of the question.
   */
  private _validateMultipleChoiceQuestion(): ValidationResult[] {
    const value = (this.answer?.value || []) as string[];

    return value.map((v) =>
      validate("inclusion", v, {
        in: (this.options || []).map(({ slug }) => slug),
      })
    );
  }

  /**
   * Method to validate a radio question. This checks if the value is included
   * in the provided options of the question.
   */
  private async _validateDynamicChoiceQuestion(): Promise<ValidationResult> {
    await taskFor(
      this.question.loadDynamicOptions.bind(this.question)
    ).perform();

    return validate("inclusion", this.answer?.value, {
      in: (this.options || []).map(({ slug }) => slug),
    });
  }

  /**
   * Method to validate a checkbox question. This checks if the all of the
   * values are included in the provided options of the question.
   */
  private async _validateDynamicMultipleChoiceQuestion(): Promise<
    ValidationResult[]
  > {
    await taskFor(
      this.question.loadDynamicOptions.bind(this.question)
    ).perform();

    const value = (this.answer?.value || []) as string[];

    return value.map((v) => {
      return validate("inclusion", v, {
        in: (this.options || []).map(({ slug }) => slug),
      });
    });
  }

  /**
   * Dummy method for the validation of file uploads.
   */
  private _validateFileQuestion(): true {
    return true;
  }

  /**
   * Method to validate a date question.
   */
  private _validateDateQuestion(): ValidationResult {
    return validate("date", this.answer?.value, {
      allowBlank: true,
    });
  }

  /**
   * Dummy method for the validation of table fields
   */
  private async _validateTableQuestion(): Promise<ValidationResult> {
    const rowValidations = await Promise.all(
      (this.answer?.value as Document[]).map(async (row) => {
        const validFields = await Promise.all(
          row.fields.map(async (field) => {
            await taskFor(field.validate.bind(field)).perform();

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
  }

  /**
   * Dummy method for the validation of static fields
   */
  private _validateStaticQuestion(): true {
    return true;
  }

  /**
   * Dummy method for the validation of form fields
   */
  private _validateFormQuestion(): true {
    return true;
  }

  /**
   * Dummy method for the validation of calculated float fields
   */
  private _validateCalculatedFloatQuestion(): true {
    return true;
  }

  /**
   * Dummy method for the validation of work item button fields
   */
  private _validateActionButtonQuestion(): true {
    return true;
  }
}
