import { Model, hasMany, belongsTo } from "ember-cli-mirage";

export default Model.extend({
  forms: hasMany(),
  options: hasMany(),
  defaultAnswer: belongsTo("answer", { inverse: null }),
});
