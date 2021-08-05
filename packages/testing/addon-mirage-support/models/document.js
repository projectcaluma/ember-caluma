import { Model, belongsTo, hasMany } from "ember-cli-mirage";

export default Model.extend({
  form: belongsTo(),
  answers: hasMany(),
  case: belongsTo(),
});
