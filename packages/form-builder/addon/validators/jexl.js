import jexl from "jexl";

const TRANSFORMS = [
  "answer",
  "mapby",
  "debug",
  "min",
  "max",
  "round",
  "ceil",
  "floor",
  "sum",
  "avg",
  "stringify",
  "flatten",
];
const BINARY_OPS = ["intersects"];

const documentJexl = new jexl.Jexl();

const noop = () => {};

TRANSFORMS.forEach((transform) => documentJexl.addTransform(transform, noop));
BINARY_OPS.forEach((binaryOp) => documentJexl.addBinaryOp(binaryOp, 0, noop));

function parseError(error) {
  const str = String(error)
    .replace(/^Error:/, "") // Remove "Error:" prefix
    .replace(/(of expression):.*$/, (_, match) => match) // Remove everything after "of expression"
    .replace(/in expression:.*$/, "") // Remove "in expression: [expression]"
    .replace(/\.$/g, "") // Remove trailing dot
    .replace(/\s\s+/g, " ") // Remove double whitespace chars
    .trim();

  return str;
}

export default function validateJexl() {
  return (key, newValue) => {
    try {
      if (newValue) {
        documentJexl.evalSync(newValue);
      }

      return true;
    } catch (error) {
      return parseError(error);
    }
  };
}
