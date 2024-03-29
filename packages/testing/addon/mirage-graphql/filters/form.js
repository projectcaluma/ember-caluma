import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class FormFilter extends BaseFilter {
  isArchived(records, value) {
    return records.filter(({ isArchived }) => isArchived === value);
  }

  isPublished(records, value) {
    return records.filter(({ isPublished }) => isPublished === value);
  }

  search(records, value) {
    const re = new RegExp(`.*${value}.*`, "i");

    return records.filter(({ slug, label }) => re.test(`${slug}${label}`));
  }
}
