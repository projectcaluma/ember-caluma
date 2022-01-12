import { Model, belongsTo, hasMany } from "miragejs";

export default Model.extend({
  document: belongsTo(),
  workflow: belongsTo(),
  parentWorkItem: belongsTo("workItem", { inverse: "childCase" }),
  workItems: hasMany(),
});
