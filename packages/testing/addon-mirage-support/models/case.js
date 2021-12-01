import { Model, belongsTo, hasMany } from "ember-cli-mirage";

export default Model.extend({
  document: belongsTo(),
  workflow: belongsTo(),
  parentWorkItem: belongsTo("workItem", { inverse: "childCase" }),
  workItems: hasMany(),
});
