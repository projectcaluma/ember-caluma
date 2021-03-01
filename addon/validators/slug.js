import buildMessage from "ember-changeset-validations/utils/validation-errors";
import {
  validatePresence,
  validateFormat,
} from "ember-changeset-validations/validators";

import and from "ember-caluma/utils/and";

const validateNamespaceSlugLength = function ({ max, namespace }) {
  return (key, newValue, oldValue, changes, content) => {
    const prefix = { ...content, ...changes }[namespace] || "";
    const slug = prefix + newValue;

    return (
      slug.length <= max ||
      buildMessage(key, {
        type: "tooLong",
        value: newValue,
        context: { max: max - prefix.length },
      })
    );
  };
};

const validateSlug = () =>
  and(
    validatePresence(true),
    validateNamespaceSlugLength({ max: 127, namespace: "namespace" }),
    validateFormat({ regex: /^[a-z0-9-]+$/ })
  );

export default validateSlug;
