import { Model, hasMany } from "ember-cli-mirage";

export default Model.extend({
  forms: hasMany(),
  options: hasMany()
});
