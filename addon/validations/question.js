import and from "ember-caluma-utils/utils/and";
import or from "ember-caluma-utils/utils/or";

import {
  validatePresence,
  validateLength,
  validateNumber
} from "ember-changeset-validations/validators";
import validateSlug from "ember-caluma-form-builder/validators/slug";
import validateType from "ember-caluma-form-builder/validators/type";
import validateGtLt from "../validators/gt-lt";

export default {
  label: and(validatePresence(true), validateLength({ max: 255 })),
  slug: validateSlug(),

  integerMinValue: or(
    validateType("IntegerQuestion", false),
    and(
      validateNumber({ allowBlank: true, integer: true }),
      validateGtLt({ lt: "integerMaxValue" })
    )
  ),
  integerMaxValue: or(
    validateType("IntegerQuestion", false),
    and(
      validateNumber({ allowBlank: true, integer: true }),
      validateGtLt({ gt: "integerMinValue" })
    )
  ),

  floatMinValue: or(
    validateType("FloatQuestion", false),
    and(
      validateNumber({ allowBlank: true }),
      validateGtLt({ lt: "floatMaxValue" })
    )
  ),
  floatMaxValue: or(
    validateType("FloatQuestion", false),
    and(
      validateNumber({ allowBlank: true }),
      validateGtLt({ gt: "floatMinValue" })
    )
  ),

  maxLength: or(
    and(
      validateType("TextQuestion", false),
      validateType("TextareaQuestion", false)
    ),
    and(validateNumber({ gt: 0, allowBlank: true }))
  )
};
