import {
  validatePresence,
  validateLength,
  validateFormat
} from "ember-changeset-validations/validators";

const validateSlug = () => (...args) =>
  [
    validatePresence(true),
    validateLength({ max: 50 }),
    validateFormat({ regex: /^[a-z0-9-]+$/ })
  ]
    .map(fn => fn(...args))
    .find(res => res !== true) || true;

export default validateSlug;
