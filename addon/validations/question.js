import and from "ember-caluma/utils/and";
import or from "ember-caluma/utils/or";

import {
  validatePresence,
  validateLength,
  validateNumber,
} from "ember-changeset-validations/validators";
import validateSlug from "ember-caluma/validators/slug";
import validateType from "ember-caluma/validators/type";
import validateGtLt from "../validators/gt-lt";
import validateOptions from "../validators/options";

export default {
  label: and(validatePresence(true), validateLength({ max: 1024 })),
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

  minLength: or(
    and(
      validateType("TextQuestion", false),
      validateType("TextareaQuestion", false)
    ),
    validateNumber({ gt: 0, allowBlank: true })
  ),
  maxLength: or(
    and(
      validateType("TextQuestion", false),
      validateType("TextareaQuestion", false)
    ),
    validateNumber({ gt: 0, allowBlank: true })
  ),

  options: or(
    and(
      validateType("MultipleChoiceQuestion", false),
      validateType("ChoiceQuestion", false)
    ),
    and(validateOptions(), validateLength({ min: 1 }))
  ),
  "rowForm.slug": or(
    validateType("TableQuestion", false),
    validatePresence(true)
  ),
  "subForm.slug": or(
    validateType("FormQuestion", false),
    validatePresence(true)
  ),
};
