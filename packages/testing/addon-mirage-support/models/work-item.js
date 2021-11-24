import { Model, belongsTo } from "ember-cli-mirage";

export default Model.extend({
  case: belongsTo(),
  childCase: belongsTo("case", { inverse: "parentWorkItem" }),
  task: belongsTo(),
  document: belongsTo(),
});
