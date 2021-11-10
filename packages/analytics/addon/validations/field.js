import {
  validatePresence,
  validateLength,
  validateFormat,
} from "ember-changeset-validations/validators";

import validateFilter from "@projectcaluma/ember-analytics/validators/filter";

export default {
  alias: [validatePresence(true), validateLength({ max: 255 })],
  slug: [
    validatePresence(true),
    validateLength({ max: 50 }),
    validateFormat({ regex: /^[a-z0-9-]+$/ }),
  ],
  dataSource: [validatePresence(true), validateLength({ max: 1024 })],
  filter: validateFilter(),
};
