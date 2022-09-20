export default function validateOptions() {
  return (_, newValue) => {
    return (
      newValue.every((option) => option.get("isValid")) || "Invalid options"
    );
  };
}
