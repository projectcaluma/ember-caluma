import BaseSerializer from "./base";
import { classify } from "@ember/string";

export default class extends BaseSerializer {
  serialize(deserialized) {
    const serialized = super.serialize(deserialized);
    const __typename = `${classify(serialized.type.toLowerCase())}Task`;

    return {
      ...serialized,
      id: btoa(`${__typename}:${deserialized.id}`),
      __typename
    };
  }
}
