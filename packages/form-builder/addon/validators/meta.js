export default function validateMeta() {
  return (key, newValue) => {
    // only allow objects {}
    if (
      typeof newValue === "object" &&
      !Array.isArray(newValue) &&
      newValue !== null
    ) {
      return true;
    }
    return "Meta is not a valid JSON object";
  };
}
