import { get } from "@ember/object";
import { Jexl } from "jexl";
import { cached } from "tracked-toolbox";

import { getAST, getTransforms } from "@projectcaluma/ember-core/utils/jexl";
import Document from "@projectcaluma/ember-form/lib/document";
import Field from "@projectcaluma/ember-form/lib/field";

/**
 * Extract dependency slugs from a jexl expression.
 *
 * E.g: 'foo'|answer in 'bar'|answer|mapby('column') would result in the
 * following dependency slugs: ['foo', 'bar', 'bar.column']
 */
export function getDependenciesFromJexl(
  jexl: Jexl,
  expression: string
): string[] {
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
      ...answerTransforms.map((transform) => transform.args[0].value as string),
      ...mapbyTransforms.flatMap((transform) => {
        const parentKey = transform.args[0].args?.[0].value as string;
        const childKeys = transform.args
          .slice(1)
          .map(({ value }) => value as string);

        return childKeys.map((key) => `${parentKey}.${key}`);
      }),
      ...stringifyTransforms.map(
        (transform) => `${transform.args[0].args?.[0].value as string}.__all__`
      ),
    ]),
  ];
}

/**
 * Getter to extract all fields used in an expression.
 */
export function dependencies(expressionPath: string, documentPath?: string) {
  return function (target: unknown, key: string): PropertyDescriptor {
    return cached(target, key, {
      get(): Field[] {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const expression = get(this, expressionPath) as string | undefined;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const document = get(this, documentPath) as Document | undefined;

        if (!expression || !document) return [];

        const slugs = getDependenciesFromJexl(document.jexl, expression);

        return slugs
          .flatMap((slug) => {
            const [fieldSlug, nestedSlug = null] = slug.split(".");

            const field = document.findField(fieldSlug);

            if (nestedSlug && field?.value) {
              // Get the nested fields from the parents value (rows)
              const rows = field.value as Document[];

              const childFields =
                nestedSlug === "__all__"
                  ? rows.flatMap((row) => row.fields)
                  : rows.map((row) => row.findField(nestedSlug));

              return [field, ...childFields];
            }

            return field;
          })
          .filter((field): field is Field => !!field);
      },
    });
  };
}

export default dependencies;
