import { validateNumber } from "ember-changeset-validations/validators";

export default function validateGtLt(options = {}) {
  return (key, newValue, oldValue, changes, content) => {
    const data = { ...content, ...changes };

    const parsedOptions = Object.entries(options).reduce((parsed, [k, v]) => {
      const value =
        /^(g|l)t(e)?$/.test(k) && typeof v === "string" ? data[v] : v;

      if (value) {
        return { ...parsed, [k]: value };
      }

      return parsed;
    }, {});

    return validateNumber(parsedOptions)(
      key,
      newValue,
      oldValue,
      changes,
      content
    );
  };
}
