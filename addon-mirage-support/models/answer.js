import { Model, belongsTo, hasMany } from "ember-cli-mirage";

export default Model.extend({
  document: belongsTo(),
  question: belongsTo(),
  tableValue: hasMany("document", { inverse: "parentAnswer" })
});
