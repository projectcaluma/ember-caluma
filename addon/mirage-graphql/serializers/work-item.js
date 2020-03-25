import BaseSerializer from "./base";
export default class extends BaseSerializer {
  serialize(deserialized) {
    const serialized = super.serialize(deserialized);

    return {
      ...serialized,
      id: btoa(`WorkItem:${deserialized.id}`),
    };
  }
}
