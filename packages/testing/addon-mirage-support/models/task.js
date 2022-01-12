import { Model, belongsTo, hasMany } from "miragejs";

export default Model.extend({
  workflow: belongsTo(),
  workItems: hasMany(),
});
