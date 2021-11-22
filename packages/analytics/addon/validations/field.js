import {
  validatePresence,
  validateLength,
  validateFormat,
} from "ember-changeset-validations/validators";

import validateFilter from "@projectcaluma/ember-analytics/validators/filter";

export default {
  alias: [
    validatePresence(true),
    validateLength({ min: 1, max: 100 }),
    validateFormat({ regex: /[\w\d\s]*/ }),
  ],
  dataSource: [validatePresence(true), validateLength({ max: 1024 })],
  filter: validateFilter(),
  // TODO: add other field properties
};
