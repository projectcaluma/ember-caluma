import {
  validatePresence,
  validateLength,
  validateInclusion
} from "ember-changeset-validations/validators";
import validateSlug from "ember-caluma-form-builder/validators/slug";

export const POSSIBLE_TYPES = [
  "number",
  "checkbox",
  "radio",
  "text",
  "textarea"
];

export default {
  label: [validatePresence(true), validateLength({ max: 255 })],
  slug: [validateSlug()],
  type: [validatePresence(true), validateInclusion({ list: POSSIBLE_TYPES })]
};
