import {
  validateLength,
  validateFormat,
} from "ember-changeset-validations/validators";

import and from "@projectcaluma/ember-core/utils/and";

export default function validateFilter(/* options = {} */) {
  return (key, newValue /* oldValue, changes, content */) => {
    if (Array.isArray(newValue)) {
      if (newValue.length) {
        newValue.foreach((element) => {
          const res = and(
            validateLength(element),
            validateFormat({ regex: /^[a-z0-9-]+$/ })
          );
          if (!res) {
            return res;
          }
        });
      }
      return true;
    }
    return "Not an Array";
  };
}
