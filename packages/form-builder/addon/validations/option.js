import {
  validatePresence,
  validateLength,
} from "ember-changeset-validations/validators";

import and from "@projectcaluma/ember-core/utils/and";
import validateSlug from "@projectcaluma/ember-form-builder/validators/slug";

export default {
  label: and(validatePresence(true), validateLength({ max: 1024 })),
  slug: validateSlug(),
};
