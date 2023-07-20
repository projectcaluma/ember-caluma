import {
  validatePresence,
  validateLength,
  validateNumber,
} from "ember-changeset-validations/validators";

import validateGtLt from "../validators/gt-lt";
import validateOptions from "../validators/options";

import and from "@projectcaluma/ember-form-builder/utils/and";
import or from "@projectcaluma/ember-form-builder/utils/or";
import validateJexl from "@projectcaluma/ember-form-builder/validators/jexl";
import validateMeta from "@projectcaluma/ember-form-builder/validators/meta";
import slugValidation from "@projectcaluma/ember-form-builder/validators/slug";
import validateType from "@projectcaluma/ember-form-builder/validators/type";

export default {
  label: and(validatePresence(true), validateLength({ max: 1024 })),
  slug: slugValidation({ type: "question" }),

  hintText: or(
    validateType("FormQuestion", true),
    validateType("StaticQuestion", true),
    validateType("FilesQuestion", true),
    validateLength({ max: 1024, allowBlank: true }),
  ),
  integerMinValue: or(
    validateType("IntegerQuestion", false),
    and(
      validateNumber({ allowBlank: true, integer: true }),
      validateGtLt({ lt: "integerMaxValue", allowNone: true }),
    ),
  ),
  integerMaxValue: or(
    validateType("IntegerQuestion", false),
    and(
      validateNumber({ allowBlank: true, integer: true }),
      validateGtLt({ gt: "integerMinValue", allowNone: true }),
    ),
  ),

  floatMinValue: or(
    validateType("FloatQuestion", false),
    and(
      validateNumber({ allowBlank: true }),
      validateGtLt({ lt: "floatMaxValue", allowNone: true }),
    ),
  ),
  floatMaxValue: or(
    validateType("FloatQuestion", false),
    and(
      validateNumber({ allowBlank: true }),
      validateGtLt({ gt: "floatMinValue", allowNone: true }),
    ),
  ),

  minLength: or(
    and(
      validateType("TextQuestion", false),
      validateType("TextareaQuestion", false),
    ),
    validateNumber({ gt: 0, allowBlank: true }),
  ),
  maxLength: or(
    and(
      validateType("TextQuestion", false),
      validateType("TextareaQuestion", false),
    ),
    validateNumber({ gt: 0, allowBlank: true }),
  ),

  options: or(
    and(
      validateType("MultipleChoiceQuestion", false),
      validateType("ChoiceQuestion", false),
    ),
    and(validateOptions(), validateLength({ min: 1 })),
  ),
  "rowForm.slug": or(
    validateType("TableQuestion", false),
    validatePresence(true),
  ),
  "subForm.slug": or(
    validateType("FormQuestion", false),
    validatePresence(true),
  ),
  isHidden: validateJexl(),
  isRequired: validateJexl(),
  meta: validateMeta(),
};
