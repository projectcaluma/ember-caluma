import BaseSerializer from "./base";
import { classify } from "@ember/string";

export default class extends BaseSerializer {
  serialize(deserialized) {
    const serialized = super.serialize(deserialized);

    return {
      ...serialized,
      __typename: `${classify(serialized.type.toLowerCase())}Answer`,
    };
  }
}
