export default function deserialize(serialized) {
  let decodedId = serialized.id;

  try {
    decodedId = atob(serialized.id).split(":")[1] || serialized.id;
  } catch (e) {
    // This will happen if the ID is not a relay ID (Type plus ID base64
    // encoded) but just the raw ID. The deserialize function needs to be able
    // to handle both
  }

  return { ...serialized, ...(decodedId ? { id: decodedId } : {}) };
}
