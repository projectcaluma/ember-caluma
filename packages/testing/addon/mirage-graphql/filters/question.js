import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class extends BaseFilter {
  isArchived(records, value) {
    return records.filter(({ isArchived }) => isArchived === value);
  }

  search(records, value) {
    const re = new RegExp(`.*${value}.*`, "i");

    return records.filter(({ slug, label }) => re.test(`${slug}${label}`));
  }

  excludeForms(records, value) {
    return records.filter(
      ({ formIds }) => !value.some((id) => (formIds || []).includes(id))
    );
  }
}
