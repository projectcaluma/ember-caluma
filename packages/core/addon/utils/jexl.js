export const intersects = (left, right) =>
  (left || []).some((val) => (right || []).includes(val));

export const mapby = (arr, ...keys) => {
  if (!Array.isArray(arr)) {
    return null;
  }

  return arr.map((obj) =>
    keys.length > 1 ? keys.map((key) => obj[key]) : obj[keys[0]]
  );
};

/**
 * Transform a JEXL expression into it's AST
 *
 * @function getAST
 * @param {JEXL} jexl The JEXL object
 * @param {String} expression JEXL expression
 * @return {Object} AST
 */
export const getAST = (jexl, expression) => {
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
const traverseTransforms = function* (tree) {
  for (const node of Object.values(tree)) {
    if (typeof node === "object") {
      yield* traverseTransforms(node);
    }
  }
  if (tree.type === "FunctionCall" && tree.pool === "transforms") {
    yield { name: tree.name, args: tree.args };
  }
};

/**
 * Get all transforms in a JEXL AST tree
 *
 * @function getTransforms
 * @param {Object} tree The JEXL AST tree or branch
 * @return {Object[]} The found transforms
 */
export const getTransforms = (tree) => {
  const iterator = traverseTransforms(tree);
  let result = iterator.next();
  const transforms = [];

  while (!result.done) {
    transforms.push(result.value);

    result = iterator.next();
  }

  return transforms;
};

export default { getTransforms, getAST };
