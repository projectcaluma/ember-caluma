import { Model, belongsTo } from "ember-cli-mirage";

export default Model.extend({
  case: belongsTo(),
  task: belongsTo(),
});
