import Base from "ember-caluma/lib/base";
import { computed, getWithDefault, defineProperty } from "@ember/object";
import { equal, not, reads, empty } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { camelize } from "@ember/string";
import { task } from "ember-concurrency";
import { all, resolve } from "rsvp";
import { validate } from "ember-validators";
import Evented from "@ember/object/evented";

import { next } from "@ember/runloop";
import { lastValue } from "ember-caluma/utils/concurrency";
import { getAST, getTransforms } from "ember-caluma/utils/jexl";
import Answer from "ember-caluma/lib/answer";
import Question from "ember-caluma/lib/question";
import { decodeId } from "ember-caluma/helpers/decode-id";

import saveDocumentFloatAnswerMutation from "ember-caluma/gql/mutations/save-document-float-answer";
import saveDocumentIntegerAnswerMutation from "ember-caluma/gql/mutations/save-document-integer-answer";
import saveDocumentStringAnswerMutation from "ember-caluma/gql/mutations/save-document-string-answer";
import saveDocumentListAnswerMutation from "ember-caluma/gql/mutations/save-document-list-answer";
import saveDocumentFileAnswerMutation from "ember-caluma/gql/mutations/save-document-file-answer";
import saveDocumentDateAnswerMutation from "ember-caluma/gql/mutations/save-document-date-answer";
import saveDocumentTableAnswerMutation from "ember-caluma/gql/mutations/save-document-table-answer";
import removeAnswerMutation from "ember-caluma/gql/mutations/remove-answer";

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
  FormQuestion: "FormAnswer",
  FileQuestion: "FileAnswer",
  StaticQuestion: null,
  DateQuestion: "DateAnswer"
};

const fieldIsHidden = field => {
  return (
    field.hidden ||
    (field.question.__typename !== "TableQuestion" &&
      (field.answer.value === null || field.answer.value === undefined))
  );
};

const getDependenciesFromJexl = expression => {
  return [
    ...new Set(
      getTransforms(getAST(expression))
        .filter(transform => transform.name === "answer")
        .map(transform => transform.subject.value)
    )
  ];
};

/**
 * An object which represents a combination of a question and an answer.
 *
 * @class Field
 */
export default Base.extend(Evented, {
  saveDocumentFloatAnswerMutation,
  saveDocumentIntegerAnswerMutation,
  saveDocumentStringAnswerMutation,
  saveDocumentListAnswerMutation,
  saveDocumentFileAnswerMutation,
  saveDocumentDateAnswerMutation,
  saveDocumentTableAnswerMutation,

  apollo: service(),

  intl: service(),

  calumaStore: service(),

  validator: service(),

  init() {
    assert("A document must be passed", this.document);

    defineProperty(this, "pk", {
      writable: false,
      value: `${this.document.pk}:Question:${this.raw.question.slug}`
    });

    this._super(...arguments);

    this._createQuestion();
    this._createAnswer();

    this.set("_errors", []);
  },

  _createQuestion() {
    const question =
      this.calumaStore.find(`Question:${this.raw.question.slug}`) ||
      Question.create(getOwner(this).ownerInjection(), {
        raw: this.raw.question
      });

    this.set("question", question);
  },

  _createAnswer() {
    let answer;

    // no answer passed, create an empty one
    if (!this.raw.answer) {
      const answerType = TYPE_MAP[this.raw.question.__typename];

      // static questions don't have an answer
      if (!answerType) {
        return;
      }

      answer = Answer.create(getOwner(this).ownerInjection(), {
        raw: {
          __typename: answerType,
          question: { slug: this.raw.question.slug },
          [camelize(answerType.replace(/Answer$/, "Value"))]: null
        }
      });
    } else {
      answer =
        this.calumaStore.find(`Answer:${decodeId(this.raw.answer.id)}`) ||
        Answer.create(getOwner(this).ownerInjection(), {
          raw: this.raw.answer
        });
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
   * Whether the field is new (never saved to the backend service)
   *
   * @property {Boolean} isNew
   * @accessor
   */
  isNew: empty("answer.pk"),

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
   * Boolean which tells whether the question is hidden or not
   *
   * @property {Boolean} hidden
   * @accessor
   */
  hidden: lastValue("hiddenTask"),

  /**
   * Boolean which tells whether the question is optional or not
   * (opposite of "required")
   *
   * @property {Boolean} optional
   * @accessor
   */
  optional: lastValue("optionalTask"),

  /**
   * Question slugs that are used in the `isHidden` JEXL expression
   *
   * If the value or visibility of any of these fields is changed, the JEXL
   * expression needs to be re-evaluated.
   *
   * @property {String[]} hiddenDependencies
   * @accessor
   */
  hiddenDependencies: computed("question.hiddenExpression", function() {
    return getDependenciesFromJexl(this.question.hiddenExpression);
  }),

  /**
   * Question slugs that are used in the `isRequired` JEXL expression
   *
   * If the value or visibility of any of these fields is changed, the JEXL
   * expression needs to be re-evaluated.
   *
   * @property {String[]} optionalDependencies
   * @accessor
   */
  optionalDependencies: computed("question.requiredExpression", function() {
    return getDependenciesFromJexl(this.question.requiredExpression);
  }),

  /**
   * Evaluate the fields hidden state.
   *
   * A question is hidden if:
   * - The form question field of the fieldset is hidden
   * - A depending field (used in the expression) is hidden
   * - The evaluated `question.isHidden` expression returns `true`
   *
   * @method hiddenTask.perform
   * @return {Boolean}
   */
  hiddenTask: task(function*() {
    const fieldsetHidden = getWithDefault(this, "fieldset.field.hidden", false);
    const dependingHidden =
      this.hiddenDependencies.length &&
      this.hiddenDependencies.every(slug =>
        fieldIsHidden(this.document.findField(slug))
      );

    const hidden =
      fieldsetHidden ||
      dependingHidden ||
      (yield this.document.jexl.eval(
        this.question.hiddenExpression,
        this.document.jexlContext
      ));

    if (this.get("hiddenTask.lastSuccessful.value") !== hidden) {
      next(this, () => this.trigger("hiddenChanged"));
    }

    return hidden;
  }).restartable(),

  /**
   * Evaluate the fields optional state.
   *
   * The field is optional if:
   * - The form question field of the fieldset is hidden
   * - A depending field (used in the expression) is hidden
   * - The evaluated `question.isRequired` expression returns `false`
   *
   * @method optionalTask.perform
   * @return {Boolean}
   */
  optionalTask: task(function*() {
    const fieldsetHidden = getWithDefault(this, "fieldset.field.hidden", false);
    const dependingHidden =
      this.optionalDependencies.length &&
      this.optionalDependencies.every(slug =>
        fieldIsHidden(this.document.findField(slug))
      );

    return (
      fieldsetHidden ||
      dependingHidden ||
      !(yield this.document.jexl.eval(
        this.question.requiredExpression,
        this.document.jexlContext
      ))
    );
  }).restartable(),

  /**
   * Task to save a field. This uses a different mutation for every answer
   * type.
   *
   * @method save.perform
   * @return {Object} The response from the server
   */
  save: task(function*() {
    const type = this.get("answer.__typename");
    const value = this.get("answer.value");

    let response;

    if (value === null || value.length === 0) {
      response = yield this.apollo.mutate(
        {
          mutation: removeAnswerMutation,
          variables: {
            input: {
              answer: this.answer.uuid
            }
          }
        },
        `removeAnswer.answer`
      );

      // remove the answer from the store and delete the data of the existing
      // answer
      this.calumaStore.delete(this.answer.pk);
      Reflect.deleteProperty(this.answer.raw, "id");
      Reflect.deleteProperty(this.answer, "id");
      Reflect.deleteProperty(this.answer, "pk");
    } else {
      response = yield this.apollo.mutate(
        {
          mutation: this.get(`saveDocument${type}Mutation`),
          variables: {
            input: {
              question: this.question.slug,
              document: this.document.uuid,
              value: this.answer.serializedValue
            }
          }
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
    }

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
  errors: computed("_errors.[]", function() {
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
  validate: task(function*() {
    const specificValidation = this.get(`_validate${this.question.__typename}`);
    assert(
      "Missing validation function for " + this.question.__typename,
      specificValidation
    );

    const validationFns = [
      ...(!this.hidden ? [this._validateRequired] : []),
      specificValidation
    ];

    const errors = (yield all(
      validationFns.map(async fn => {
        const res = await fn.call(this);

        return Array.isArray(res) ? res : [res];
      })
    ))
      .reduce((arr, e) => [...arr, ...e], []) // flatten the array
      .filter(e => typeof e === "object");

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
  _validateTextQuestion() {
    return [
      ...this.validator.validate(
        this.get("answer.value"),
        this.getWithDefault("question.meta.formatValidators", [])
      ),
      validate("length", this.get("answer.value"), {
        max: this.get("question.textMaxLength") || Number.POSITIVE_INFINITY
      })
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
  _validateTextareaQuestion() {
    return [
      ...this.validator.validate(
        this.get("answer.value"),
        this.getWithDefault("question.meta.formatValidators", [])
      ),
      validate("length", this.get("answer.value"), {
        max: this.get("question.textareaMaxLength") || Number.POSITIVE_INFINITY
      })
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
      lte: this.get("question.integerMaxValue") || Number.POSITIVE_INFINITY
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
      lte: this.get("question.floatMaxValue") || Number.POSITIVE_INFINITY
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
      in: this.getWithDefault("question.choiceOptions.edges", []).map(
        option => option.node.slug
      )
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
    return value.map(value =>
      validate("inclusion", value, {
        in: this.getWithDefault("question.multipleChoiceOptions.edges", []).map(
          option => option.node.slug
        )
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
  _validateDynamicChoiceQuestion() {
    return validate("inclusion", this.get("answer.value"), {
      in: this.getWithDefault("question.dynamicChoiceOptions.edges", []).map(
        option => option.node.slug
      )
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
  _validateDynamicMultipleChoiceQuestion() {
    const value = this.get("answer.value");
    if (!value) {
      return true;
    }
    return value.map(value => {
      return validate("inclusion", value, {
        in: this.getWithDefault(
          "question.dynamicMultipleChoiceOptions.edges",
          []
        ).map(option => option.node.slug)
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
      allowBlank: true
    });
  },

  /**
   * Dummy method for the validation of table fields
   *
   * @method _validateTableQuestion
   * @return {RSVP.Promise}
   * @private
   */
  _validateTableQuestion() {
    return resolve(true);
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

  /**
   * Validate that every dependent field of this field exists in the document
   *
   * @method _validateExpressions
   * @private
   */
  _validateExpressions() {
    const dependencies = [
      ...new Set([...this.hiddenDependencies, ...this.optionalDependencies])
    ];

    dependencies.forEach(slug => {
      assert(
        `Field for question \`${slug}\` was not found in this document. Please check the jexl expressions of the question \`${this.question.slug}\`.`,
        this.document.findField(slug)
      );
    });
  }
});
