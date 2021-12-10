import Model, { attr, belongsTo } from "@ember-data/model";

export default class GroupModel extends Model {
  @attr name;
  @belongsTo("groupType") type;
}
