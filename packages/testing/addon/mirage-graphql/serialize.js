import { classify } from "@ember/string";

export default function serialize(deserialized = {}, type) {
  const __typename = [deserialized.type?.toLowerCase(), type]
    .filter(Boolean)
    .map(classify)
    .join("");

  return {
    ...deserialized,
    id: btoa(`${__typename}:${deserialized.id}`),
    __typename,
  };
}
