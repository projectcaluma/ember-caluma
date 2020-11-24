import {
  validatePresence,
  validateLength,
} from "ember-changeset-validations/validators";

import and from "ember-caluma/utils/and";
import validateSlug from "ember-caluma/validators/slug";

export default {
  label: and(validatePresence(true), validateLength({ max: 1024 })),
  slug: validateSlug(),
};
