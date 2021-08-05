import { computed, get } from "@ember/object";

import { getAST, getTransforms } from "@projectcaluma/ember-core/utils/jexl";

/**
 * Extract dependency slugs from a jexl expression.
 *
 * E.g: 'foo'|answer in 'bar'|answer|mapby('column') would result in the
 * following dependency slugs: ['foo', 'bar', 'bar.column']
 *
 * @param {Jexl} jexl
 * @param {String} expression
 * @return {String[]} Returns an array of dependency slugs
 */
export function getDependenciesFromJexl(jexl, expression) {
  const allTransforms = getTransforms(getAST(jexl, expression));
  const answerTransforms = allTransforms.filter(
    (transform) => transform.name === "answer"
  );
  const mapbyTransforms = allTransforms.filter(
    (transform) =>
      transform.name === "mapby" &&
      transform.args[0].type === "FunctionCall" &&
      transform.args[0].name === "answer"
  );
  const stringifyTransforms = allTransforms.filter(
    (transform) =>
      transform.name === "stringify" &&
      transform.args[0].type === "FunctionCall" &&
      transform.args[0].name === "answer"
  );

  return [
    ...new Set([
      ...answerTransforms.map((transform) => transform.args[0].value),
      ...mapbyTransforms.flatMap((transform) => {
        const parentKey = transform.args[0].args[0].value;
        const childKeys = transform.args.slice(1).map(({ value }) => value);

        return childKeys.map((key) => `${parentKey}.${key}`);
      }),
      ...stringifyTransforms.map(
        (transform) => `${transform.args[0].args[0].value}.__all__`
      ),
    ]),
  ];
}

/**
 * Computed property to get all nested dependency parents of an expression. A
 * nested dependency parent would be a table field that is used with a mapby
 * transform in the JEXL expression.
 *
 * E.g: 'foo'|answer in 'bar'|answer|mapby('column') where 'bar' would be a
 * nested dependency parent.
 *
 * Those need to be extracted seperately since the overall dependencies need to
 * depend on the values of the nested dependency parents to recompute
 * correctly.
 *
 * @param {String} expressionPath The path of the expression
 * @return {Field[]} Returns an array of nested dependency parent fields
 */
export function nestedDependencyParents(expressionPath) {
  return dependencies(expressionPath, { onlyNestedParents: true });
}

/**
 * Computed property to get all dependencies of an expression.
 *
 * @param {String} expressionPath The path of the expression
 * @param {Object} options
 * @param {Boolean} options.onlyNestedParents Only include nested parent fields
 * @param {String} options.nestedParentsPath Path of the nested parent fields to trigger recomputation
 * @return {Field[]} Returns an array of all dependency fields
 */
export function dependencies(
  expressionPath,
  { onlyNestedParents = false, nestedParentsPath = null } = {}
) {
  // If there are nested parents we need to recompute the property if their
  // values change
  const nestedTriggers = nestedParentsPath
    ? [`${nestedParentsPath}.@each.value`]
    : [];

  return computed(
    "document.{jexl,fields.[]}",
    expressionPath,
    ...nestedTriggers,
    function () {
      const expression = get(this, expressionPath);

      if (!expression) return [];

      const slugs = getDependenciesFromJexl(this.document.jexl, expression);

      return slugs
        .flatMap((slug) => {
          const [fieldSlug, nestedSlug = null] = slug.split(".");

          if (onlyNestedParents && !nestedSlug) {
            return null;
          }

          const field = this.document.findField(fieldSlug);

          if (!onlyNestedParents && nestedSlug && field?.value) {
            // Get the nested fields from the parents value (rows)
            const childFields =
              nestedSlug === "__all__"
                ? field.value.flatMap((row) => row.fields)
                : field.value.map((row) => row.findField(nestedSlug));

            return [field, ...childFields];
          }

          return [field];
        })
        .filter(Boolean);
    }
  );
}

export default dependencies;
