import { Model, hasMany } from "miragejs";

export default Model.extend({
  questions: hasMany(),
});
