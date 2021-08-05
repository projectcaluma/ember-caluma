import { Model, belongsTo, hasMany } from "ember-cli-mirage";

export default Model.extend({
  workflow: belongsTo(),
  workItems: hasMany(),
});
