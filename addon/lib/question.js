import { assert } from "@ember/debug";
import { defineProperty, computed } from "@ember/object";
import { reads, equal } from "@ember/object/computed";
import { camelize } from "@ember/string";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";

import getDynamicOptions from "ember-caluma/gql/queries/get-dynamic-options";
import Base from "ember-caluma/lib/base";

const getValue = (answer) => {
  return answer[camelize(answer.__typename.replace(/Answer$/, "Value"))];
};

/**
 * Object which represents a question in context of a field
 *
 * @class Question
 */
export default Base.extend({
  apollo: queryManager(),

  init(...args) {
    assert(
      "A graphql question `raw` must be passed",
      this.raw && /Question$/.test(this.raw.__typename)
    );

    defineProperty(this, "pk", {
      writable: false,
      value: `Question:${this.raw.slug}`,
    });

    this._super(...args);

    this.setProperties(this.raw);
  },

  /**
   * Load all dynamic options for this question
   *
   * @method loadDynamicOptions.perform
   * @return {Object[]} The dynamic options
   * @public
   */
  loadDynamicOptions: task(function* () {
    if (!this.isDynamic) return;

    const [question] = yield this.apollo.query(
      {
        query: getDynamicOptions,
        fetchPolicy: "network-only",
        variables: { question: this.slug },
      },
      "allQuestions.edges"
    );

    return (
      question.node.dynamicChoiceOptions ||
      question.node.dynamicMultipleChoiceOptions
    );
  }),

  dynamicChoiceOptions: reads("loadDynamicOptions.lastSuccessful.value"),
  dynamicMultipleChoiceOptions: reads(
    "loadDynamicOptions.lastSuccessful.value"
  ),

  /**
   * Whether the question is a single choice question
   *
   * @property {Boolean} isChoice
   * @accessor
   */
  isChoice: computed("__typename", function () {
    return /(Dynamic)?ChoiceQuestion/.test(this.__typename);
  }),

  /**
   * Whether the question is a multiple choice question
   *
   * @property {Boolean} isMultipleChoice
   * @accessor
   */
  isMultipleChoice: computed("__typename", function () {
    return /(Dynamic)?MultipleChoiceQuestion/.test(this.__typename);
  }),

  /**
   * Whether the question is a dynamic single or multiple choice question
   *
   * @property {Boolean} isDynamic
   * @accessor
   */
  isDynamic: computed("__typename", function () {
    return /Dynamic(Multiple)?ChoiceQuestion/.test(this.__typename);
  }),

  isTable: equal("__typename", "TableQuestion"),
  isCalculated: equal("__typename", "CalculatedFloatQuestion"),

  /**
   * All valid options for this question
   *
   * @property {Object[]} options
   * @accessor
   */
  options: computed(
    "__typename",
    "choiceOptions.edges.[]",
    "dynamicChoiceOptions.edges.[]",
    "dynamicMultipleChoiceOptions.edges.[]",
    "isChoice",
    "isMultipleChoice",
    "multipleChoiceOptions.edges.[]",
    function () {
      if (!this.isChoice && !this.isMultipleChoice) return null;

      const key = camelize(this.__typename.replace(/Question$/, "Options"));

      return (this.get(`${key}.edges`) || []).map(
        ({ node: { label, slug, isArchived } }) => ({
          label,
          slug,
          disabled: isArchived || false,
        })
      );
    }
  ),

  defaultValue: computed(
    "__typename",
    "isTable",
    "textDefaultAnswer",
    "textareaDefaultAnswer",
    "integerDefaultAnswer",
    "floatDefaultAnswer",
    "choiceDefaultAnswer",
    "multipleChoiceDefaultAnswer.[]",
    "dateDefaultAnswer",
    "tableDefaultAnswer.[]",
    function () {
      const key = camelize(
        this.__typename.replace(/Question$/, "DefaultAnswer")
      );

      const value = this[key] && this[key].value;

      if (this.isTable && value) {
        return value.map((defaultDocument) => {
          return defaultDocument.answers.edges.reduce(
            (defaultMap, { node: answer }) => {
              return {
                ...defaultMap,
                [answer.question.slug]: getValue(answer),
              };
            },
            {}
          );
        });
      }

      return value;
    }
  ),
});
