import { camelize } from "@ember/string";
import { queryManager, ApolloQueryManager } from "ember-apollo-client";
import { dropTask, lastValue, TaskGenerator } from "ember-concurrency";
import { cached } from "tracked-toolbox";

import getDynamicOptions from "@projectcaluma/ember-form/gql/queries/dynamic-options.graphql";
import Base from "@projectcaluma/ember-form/lib/base";

const getValue = (answer: RawAnswer): unknown => {
  return answer[camelize(answer.__typename.replace(/Answer$/, "Value"))];
};

/**
 * Object which represents a question in context of a field
 */
export default class Question extends Base {
  @queryManager declare apollo: ApolloQueryManager;

  constructor({ raw, owner }: { raw: RawQuestion; owner: unknown }) {
    super({ owner });

    this.raw = raw;

    this.pushIntoStore();
  }

  /**
   * The raw data of the question
   */
  readonly raw: RawQuestion;

  /**
   * The primary key of the question.
   */
  @cached
  get pk(): string {
    return `Question:${this.slug}`;
  }

  /**
   * The slug of the question.
   */
  @cached
  get slug(): string {
    return this.raw.slug;
  }

  /**
   * Load all dynamic options for this question
   */
  @dropTask
  *loadDynamicOptions(): TaskGenerator<OptionConnection | undefined> {
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
      (question.node.dynamicChoiceOptions as OptionConnection) ??
      (question.node.dynamicMultipleChoiceOptions as OptionConnection)
    );
  }

  @lastValue("loadDynamicOptions") dynamicChoiceOptions:
    | OptionConnection
    | undefined;
  @lastValue("loadDynamicOptions") dynamicMultipleChoiceOptions:
    | OptionConnection
    | undefined;

  /**
   * Whether the question is a single choice question
   */
  get isChoice(): boolean {
    return /(Dynamic)?ChoiceQuestion/.test(this.raw.__typename);
  }

  /**
   * Whether the question is a multiple choice question
   */
  get isMultipleChoice(): boolean {
    return /(Dynamic)?MultipleChoiceQuestion/.test(this.raw.__typename);
  }

  /**
   * Whether the question is a dynamic single or multiple choice question
   */
  get isDynamic(): boolean {
    return /Dynamic(Multiple)?ChoiceQuestion/.test(this.raw.__typename);
  }

  /**
   * Whether the question is a table question
   */
  get isTable(): boolean {
    return this.raw.__typename === "TableQuestion";
  }

  /**
   * Whether the question is a calculated question
   */
  get isCalculated(): boolean {
    return this.raw.__typename === "CalculatedFloatQuestion";
  }

  /**
   * All valid options for this question
   */
  @cached
  get options(): Option[] {
    if (!this.isChoice && !this.isMultipleChoice) return [];

    const key = camelize(this.raw.__typename.replace(/Question$/, "Options"));
    const raw = this.isDynamic
      ? this.dynamicChoiceOptions ?? this.dynamicMultipleChoiceOptions
      : (this.raw[key] as OptionConnection | undefined);

    return (raw?.edges || []).map(({ node: { label, slug, isArchived } }) => ({
      label,
      slug,
      disabled: isArchived || false,
    }));
  }

  /**
   * The default value of the question
   */
  @cached
  get defaultValue(): string | number | string[] | RawDocument[] {
    const key = camelize(
      this.raw.__typename.replace(/Question$/, "DefaultAnswer")
    );

    const value = this.raw[key]?.value;

    if (this.isTable && value) {
      return value.map(
        (defaultDocument: { answers: { edges: { node: RawAnswer }[] } }) => {
          return defaultDocument.answers.edges.reduce(
            (defaultMap: Record<string, unknown>, { node: answer }) => {
              return {
                ...defaultMap,
                [answer.question.slug]: getValue(answer),
              };
            },
            {}
          );
        }
      );
    }

    return value;
  }
}
