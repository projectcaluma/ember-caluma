import { helper } from "@ember/component/helper";
import { dasherize } from "@ember/string";

// Remove "Question" from typename and dasherize it. This transforms e.g.
// "DynamicMultipleChoiceQuestion" to "dynamic-multiple-choice" which is easier
// to use in a template
const parse = (raw) => dasherize(raw.replace("Question", ""));

export default helper(function hasQuestionType([obj, ...expected]) {
  return expected.map(parse).includes(parse(obj.__typename || ""));
});
