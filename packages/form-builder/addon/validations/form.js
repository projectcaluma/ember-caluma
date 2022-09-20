import {
  validatePresence,
  validateLength,
} from "ember-changeset-validations/validators";

import slugValidation from "@projectcaluma/ember-form-builder/validators/slug";

export default {
  name: [validatePresence(true), validateLength({ max: 255 })],
  slug: slugValidation({ type: "form", maxLength: 50 }),
};
