import { Model, belongsTo, hasMany } from "miragejs";

export default Model.extend({
  document: belongsTo("document"),
  question: belongsTo(),
  documents: hasMany("document", { inverse: null }),
});
