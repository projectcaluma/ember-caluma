import OptionValidations from "../validations/option";
import lookupValidator from "ember-changeset-validations";
import Changeset from "ember-changeset";
import { Promise, all } from "rsvp";

export default function validateOptions() {
  return (_, value) => {
    return new Promise(resolve => {
      all(
        value.edges.map(async ({ node: option }) => {
          const cs = new Changeset(
            option,
            lookupValidator(OptionValidations),
            OptionValidations
          );

          await cs.validate();

          return cs.get("isValid");
        })
      ).then(res => resolve(res.every(Boolean) || "Invalid options"));
    });
  };
}
