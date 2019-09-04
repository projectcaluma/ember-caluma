import { computed } from "@ember/object";
import jexl from "jexl";

export const intersects = (left, right) =>
  left.some(val => right.includes(val));

/**
 * Transform a JEXL expression into it's AST
 *
 * @function getAST
 * @param {String} expression JEXL expression
 * @return {Object} AST
 */
export const getAST = expression => {
  jexl.addBinaryOp("intersects", 20, intersects);

  return jexl.createExpression(expression)._getAst();
};

/**
 * Generator to walk down a JEXL AST tree and yield all transforms
 *
 * @generator
 * @private
 * @function traverseTransforms
 * @param {Object} tree The JEXL AST tree or branch
 * @yields {Object} The found transform
 */
const traverseTransforms = function*(tree) {
  for (let node of Object.values(tree)) {
    if (typeof node === "object") {
      yield* traverseTransforms(node);
    }
  }
  if (tree.type && tree.type === "Transform") {
    yield { name: tree.name, subject: tree.subject, args: tree.args };
  }
};

/**
 * Get all transforms in a JEXL AST tree
 *
 * @function getTransforms
 * @param {Object} tree The JEXL AST tree or branch
 * @return {Object[]} The found transforms
 */
export const getTransforms = tree => {
  let iterator = traverseTransforms(tree);
  let result = iterator.next();
  let transforms = [];

  while (!result.done) {
    transforms.push(result.value);

    result = iterator.next();
  }

  return transforms;
};

/**
 * Function to clean all whitespace characters of a jexl expression
 *
 * @function cleanExpression
 * @param {String} expression The raw expression
 * @return {String} The cleaned expression
 *
 * @todo Remove this when https://github.com/TomFrost/Jexl/pull/54/ is merged
 */
export const cleanExpression = expression => {
  return expression.replace(/\s+/g, " ").trim();
};

/**
 * Computed property macro for automatically cleaning expression's whitespace
 * characters.
 *
 * @function expression
 * @param {String} key Key of the property holding the raw expression
 * @return {Function} The computed property
 *
 * @todo Remove this when https://github.com/TomFrost/Jexl/pull/54/ is merged
 */
export const expression = key =>
  computed(key, function() {
    return cleanExpression(this.get(key));
  });

export default { getTransforms, getAST, cleanExpression, expression };
