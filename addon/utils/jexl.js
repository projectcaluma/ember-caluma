import Parser from "jexl/lib/parser/Parser";
import jexl from "jexl";

/**
 * Transform a JEXL expression into it's AST
 *
 * @function getAST
 * @param {String} expression JEXL expression
 * @return {Object} AST
 */
export const getAST = expression => {
  let grammar = jexl._getGrammar();
  let parser = new Parser(grammar);

  parser.addTokens(jexl._getLexer().tokenize(expression));

  return parser.complete();
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

export default { getTransforms, getAST };
