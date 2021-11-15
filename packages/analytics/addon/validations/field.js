import {
  validatePresence,
  validateLength,
  validateFormat,
} from "ember-changeset-validations/validators";

import validateFilter from "@projectcaluma/ember-analytics/validators/filter";

export default {
  alias: [
    validatePresence(true),
    validateLength({ max: 100 }),
    validateFormat({ regex: /^[a-z0-9-]+$/ }),
  ],
  dataSource: [validatePresence(true), validateLength({ max: 1024 })],
  filter: validateFilter(),
  // TODO: add other field properties
};
