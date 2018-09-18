import BaseFilter from "./base";

export default class extends BaseFilter {
  isArchived(records, value) {
    return records.filter(({ isArchived }) => isArchived === value);
  }
}
