import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class extends BaseFilter {
  questions(records, value, { invert = false }) {
    return records.filter(
      (record) => invert !== value.includes(record.questionId)
    );
  }

  question(records, value, { invert = false }) {
    return this.questions(records, [value], { invert });
  }
}
