import {
  validatePresence,
  validateLength,
} from "ember-changeset-validations/validators";

import slugValidation from "@projectcaluma/ember-form-builder/validators/slug";

export default {
  label: [validatePresence(true), validateLength({ max: 1024 })],
  slug: slugValidation({ type: "option" }),
};
