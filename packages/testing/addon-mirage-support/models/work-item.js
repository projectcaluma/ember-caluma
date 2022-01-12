import { Model, belongsTo } from "miragejs";

export default Model.extend({
  case: belongsTo(),
  childCase: belongsTo("case", { inverse: "parentWorkItem" }),
  task: belongsTo(),
  document: belongsTo(),
});
