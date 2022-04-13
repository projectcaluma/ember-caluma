import { helper } from "@ember/component/helper";

export function formatGraphqlErrorObject(error) {
  try {
    const path = error.path.join(".");
    const { line, column } = error.locations[error.locations.length - 1];

    return `${path}:${line}:${column}: ${error.message}`;
  } catch (e) {
    return null;
  }
}

export function formatGraphqlError(error) {
  return (
    error?.errors?.map(formatGraphqlErrorObject).filter(Boolean).join("\n") ??
    ""
  );
}

export default helper(([error]) => formatGraphqlError(error));
