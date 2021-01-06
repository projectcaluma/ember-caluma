import { helper } from "@ember/component/helper";
import { dasherize } from "@ember/string";

export default helper(function hasQuestionType(
  [obj, ...expected],
  { replace = "Question" }
) {
  const typename = dasherize((obj.__typename || "").replace(replace, ""));
  const typenames = expected.map((typename) =>
    dasherize(typename.replace(replace, ""))
  );

  return typenames.includes(typename);
});
