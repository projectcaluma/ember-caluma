import { Model, belongsTo, hasMany } from "ember-cli-mirage";

export default Model.extend({
  document: belongsTo(),
  workflow: belongsTo(),
  workItems: hasMany(),
});
