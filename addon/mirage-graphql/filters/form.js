import BaseFilter from "ember-caluma-form-builder/mirage-graphql/filters/base";

export default class extends BaseFilter {
  isArchived(records, value) {
    return records.filter(({ isArchived }) => isArchived === value);
  }
}
