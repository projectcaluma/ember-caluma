import {
  validatePresence,
  validateLength
} from "ember-changeset-validations/validators";
import validateSlug from "ember-caluma-form-builder/validators/slug";

export default {
  label: [validatePresence(true), validateLength({ max: 255 })],
  slug: [validateSlug()]
};
