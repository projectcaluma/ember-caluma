import { Model, belongsTo, hasMany } from "miragejs";

export default Model.extend({
  form: belongsTo(),
  answers: hasMany(),
  case: belongsTo(),
  workItem: belongsTo(),
});
