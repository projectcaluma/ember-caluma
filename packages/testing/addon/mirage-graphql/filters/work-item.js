import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class extends BaseFilter {
  status(records, value) {
    return records.filter(({ status }) => status === value);
  }
}
