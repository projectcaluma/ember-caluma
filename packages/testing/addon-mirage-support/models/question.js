import { Model, hasMany, belongsTo } from "miragejs";

export default Model.extend({
  forms: hasMany({ inverse: "questions" }),
  options: hasMany(),
  subForm: belongsTo("form", { inverse: null }),
  rowForm: belongsTo("form", { inverse: null }),
  defaultAnswer: belongsTo("answer", { inverse: null }),
  formatValidators: hasMany(),
});
