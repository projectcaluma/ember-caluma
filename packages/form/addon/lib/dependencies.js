import { get } from "@ember/object";
import { cached } from "tracked-toolbox";

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
 * Getter to extract all fields used in an expression.
 *
 * @param {String} expressionPath The path of the expression
 * @return {Field[]} An array of all dependency fields
 */
export function dependencies(expressionPath) {
  return function (target, key) {
    return cached(target, key, {
      get() {
        const expression = get(this, expressionPath);

        if (!expression) return [];

        const slugs = getDependenciesFromJexl(this.document.jexl, expression);

        return slugs
          .flatMap((slug) => {
            const [fieldSlug, nestedSlug = null] = slug.split(".");

            const field = this.document.findField(fieldSlug);

            if (nestedSlug && field?.value) {
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
      },
    });
  };
}

export default dependencies;
