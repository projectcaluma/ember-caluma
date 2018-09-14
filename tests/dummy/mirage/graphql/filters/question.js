import BaseFilter from "./base";

export default class extends BaseFilter {
  search(records, value) {
    const re = new RegExp(`.*${value}.*`, "i");

    return records.filter(({ slug, label }) => re.test(`${slug}${label}`));
  }

  formId(records, value) {
    return records.filter(({ formIds }) => formIds.include(value));
  }

  excludeFormId(records, value) {
    return records.filter(({ formIds }) => !formIds.include(value));
  }
}
