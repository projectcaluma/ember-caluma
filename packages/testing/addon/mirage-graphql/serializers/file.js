import BaseSerializer from "./base";

export default class FileSerializer extends BaseSerializer {
  serialize(deserialized) {
    const serialized = super.serialize(deserialized);

    return {
      ...serialized,
      id: btoa(`File:${deserialized.id}`),
    };
  }
}
