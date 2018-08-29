import {
  validatePresence,
  validateLength,
  validateInclusion
} from "ember-changeset-validations/validators";
import validateSlug from "ember-caluma-form-builder/validators/slug";

export const POSSIBLE_TYPES = [
  "NUMBER",
  "CHECKBOX",
  "RADIO",
  "TEXT",
  "TEXTAREA"
];

export default {
  label: [validatePresence(true), validateLength({ max: 255 })],
  slug: [validateSlug()],
  type: [validatePresence(true), validateInclusion({ list: POSSIBLE_TYPES })]
};
