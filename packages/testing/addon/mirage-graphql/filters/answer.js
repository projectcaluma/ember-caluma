import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class extends BaseFilter {
  questions(records, value) {
    const questionIds = this.db.questions
      .filter(({ slug }) => value.includes(slug))
      .map(({ id }) => id);

    return records.filter(({ questionId }) => questionIds.includes(questionId));
  }

  question(records, value) {
    return this.questions(records, [value]);
  }
}
