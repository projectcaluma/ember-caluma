import BaseFilter from "ember-caluma/mirage-graphql/filters/base";

export default class extends BaseFilter {
  isArchived(records, value) {
    return records.filter(({ isArchived }) => isArchived === value);
  }

  search(records, value) {
    const re = new RegExp(`.*${value}.*`, "i");

    return records.filter(({ slug, label }) => re.test(`${slug}${label}`));
  }

  excludeForms(records, value) {
    const forms = this.db.forms.filter(({ slug }) => value.includes(slug));

    return records.filter(
      ({ formIds }) => !forms.some(({ id }) => (formIds || []).includes(id))
    );
  }
}
