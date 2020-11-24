import { classify } from "@ember/string";

import BaseSerializer from "./base";

export default class extends BaseSerializer {
  serialize(deserialized) {
    const serialized = super.serialize(deserialized);

    return {
      ...serialized,
      __typename: `${classify(serialized.type.toLowerCase())}Answer`,
    };
  }
}
