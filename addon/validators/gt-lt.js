import buildMessage from "ember-changeset-validations/utils/validation-errors";
import getMessages from "ember-changeset-validations/utils/get-messages";

export default function validateGtLt(options = { gt: null, lt: null }) {
  return (key, newValue, oldValue, changes, content) => {
    newValue = Number(newValue);

    if (!newValue) {
      return true;
    }

    const messages = getMessages();

    if (options.gt) {
      const dependentValue = Object.assign(content, changes)[options.gt];

      return dependentValue
        ? Number(newValue) > Number(dependentValue) ||
            buildMessage(key, {
              type: "greaterThan",
              value: newValue,
              context: {
                gt: messages.getDescriptionFor(options.gt),
              },
            })
        : true;
    }

    if (options.lt) {
      const dependentValue = Object.assign(content, changes)[options.lt];

      return dependentValue
        ? Number(newValue) < Number(dependentValue) ||
            buildMessage(key, {
              type: "lessThan",
              value: newValue,
              context: {
                lt: messages.getDescriptionFor(options.lt),
              },
            })
        : true;
    }

    return true;
  };
}
