export const slugToId = (type, slug) => btoa(`${type}:${slug}`);
export const idToSlug = id => atob(id).split(":")[1];

export default class {
  serialize(deserialized) {
    const { slug = null, ...obj } = deserialized || {};

    return slug
      ? {
          ...obj,
          slug,
          id: slugToId(slug, this.type)
        }
      : obj;
  }

  deserialize(serialized) {
    const { id = null, ...obj } = serialized || {};

    return id
      ? {
          slug: idToSlug(id),
          ...obj
        }
      : obj;
  }
}
