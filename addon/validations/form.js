import {
  validatePresence,
  validateLength,
  validateFormat,
} from "ember-changeset-validations/validators";

export default {
  name: [validatePresence(true), validateLength({ max: 255 })],
  slug: [
    validatePresence(true),
    validateLength({ max: 50 }),
    validateFormat({ regex: /^[a-z0-9-]+$/ }),
  ],
};
