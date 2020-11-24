import {
  validatePresence,
  validateLength,
  validateFormat,
} from "ember-changeset-validations/validators";

import and from "ember-caluma/utils/and";

const validateSlug = () =>
  and(
    validatePresence(true),
    validateLength({ max: 127 }),
    validateFormat({ regex: /^[a-z0-9-]+$/ })
  );

export default validateSlug;
