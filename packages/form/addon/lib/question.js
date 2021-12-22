import { assert } from "@ember/debug";
import { camelize } from "@ember/string";
import { queryManager } from "ember-apollo-client";
import { dropTask, lastValue } from "ember-concurrency";
import { cached } from "tracked-toolbox";

import getDynamicOptions from "@projectcaluma/ember-form/gql/queries/dynamic-options.graphql";
import Base from "@projectcaluma/ember-form/lib/base";

const getValue = (answer) => {
  return answer[camelize(answer.__typename.replace(/Answer$/, "Value"))];
};

/**
 * Object which represents a question in context of a field
 *
 * @class Question
 */
export default class Question extends Base {
  @queryManager apollo;

  constructor({ raw, ...args }) {
    assert(
      "A graphql question `raw` must be passed",
      /Question$/.test(raw?.__typename)
    );

    super({ raw, ...args });

    this.pushIntoStore();
  }

  /**
   * The primary key of the question.
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    return `Question:${this.slug}`;
  }

  /**
   * The slug of the question.
   *
   * @property {String} slug
   */
  @cached
  get slug() {
    return this.raw.slug;
  }

  /**
   * Load all dynamic options for this question
   *
   * @method loadDynamicOptions.perform
   * @return {Object[]} The dynamic options
   * @public
   */
  @dropTask
  *loadDynamicOptions() {
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
  }

  @lastValue("loadDynamicOptions") dynamicChoiceOptions;
  @lastValue("loadDynamicOptions") dynamicMultipleChoiceOptions;

  /**
   * Whether the question is a single choice question
   *
   * @property {Boolean} isChoice
   */
  get isChoice() {
    return /(Dynamic)?ChoiceQuestion/.test(this.raw.__typename);
  }

  /**
   * Whether the question is a multiple choice question
   *
   * @property {Boolean} isMultipleChoice
   */
  get isMultipleChoice() {
    return /(Dynamic)?MultipleChoiceQuestion/.test(this.raw.__typename);
  }

  /**
   * Whether the question is a dynamic single or multiple choice question
   *
   * @property {Boolean} isDynamic
   */
  get isDynamic() {
    return /Dynamic(Multiple)?ChoiceQuestion/.test(this.raw.__typename);
  }

  /**
   * Whether the question is a table question
   *
   * @property {Boolean} isTable
   */
  get isTable() {
    return this.raw.__typename === "TableQuestion";
  }

  /**
   * Whether the question is a calculated question
   *
   * @property {Boolean} isCalculated
   */
  get isCalculated() {
    return this.raw.__typename === "CalculatedFloatQuestion";
  }

  /**
   * All valid options for this question
   *
   * @property {Object[]} options
   */
  @cached
  get options() {
    if (!this.isChoice && !this.isMultipleChoice) return null;

    const key = camelize(this.raw.__typename.replace(/Question$/, "Options"));
    const raw = this.isDynamic ? this[key] : this.raw[key];

    return (raw?.edges || []).map(({ node: { label, slug, isArchived } }) => ({
      label,
      slug,
      disabled: isArchived || false,
    }));
  }

  /**
   * The default value of the question
   *
   * @property {String|Number|String[]|Object[]} defaultValue
   */
  @cached
  get defaultValue() {
    const key = camelize(
      this.raw.__typename.replace(/Question$/, "DefaultAnswer")
    );

    const value = this.raw[key]?.value;

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
}
