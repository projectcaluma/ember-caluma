import {
  validatePresence,
  validateLength,
  validateFormat,
} from "ember-changeset-validations/validators";

export default {
  alias: [
    validatePresence(true),
    validateLength({ min: 1, max: 100 }),
    validateFormat({ regex: /[\w\d\s]*/ }),
  ],
  dataSource: [validatePresence(true), validateLength({ max: 1024 })],
};
