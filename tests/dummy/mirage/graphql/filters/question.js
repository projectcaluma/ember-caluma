import BaseFilter from "./base";
import { idToSlug } from "../serializers/base";

export default class extends BaseFilter {
  isArchived(records, value) {
    return records.filter(({ isArchived }) => isArchived === value);
  }

  search(records, value) {
    const re = new RegExp(`.*${value}.*`, "i");

    return records.filter(({ slug, label }) => re.test(`${slug}${label}`));
  }

  excludeForms(records, value) {
    const slugs = value.map(v => idToSlug(v));
    const forms = this.db.forms.filter(({ slug }) => slugs.includes(slug));

    return records.filter(
      ({ formIds }) => !forms.some(({ id }) => (formIds || []).includes(id))
    );
  }
}
