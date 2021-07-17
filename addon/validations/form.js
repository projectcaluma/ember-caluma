import {
  validatePresence,
  validateLength,
} from "ember-changeset-validations/validators";

import validateSlug from "../validators/slug";

export default {
  name: [validatePresence(true), validateLength({ max: 255 })],
  slug: validateSlug(),
};
