import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class AnswerFilter extends BaseFilter {
  questions(records, value) {
    return records.filter((record) => value.includes(record.questionId));
  }

  question(records, value) {
    return this.questions(records, [value]);
  }
}
