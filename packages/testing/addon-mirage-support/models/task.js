import { Model, belongsTo, hasMany } from "miragejs";

export default Model.extend({
  form: belongsTo(),
  workflow: belongsTo(),
  workItems: hasMany(),
});
