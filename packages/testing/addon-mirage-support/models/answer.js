import { Model, belongsTo, hasMany } from "ember-cli-mirage";

export default Model.extend({
  document: belongsTo("document"),
  question: belongsTo(),
  documents: hasMany("document", { inverse: null }),
});
