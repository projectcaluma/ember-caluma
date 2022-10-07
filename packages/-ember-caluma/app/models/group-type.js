import Model, { attr, hasMany } from "@ember-data/model";

export default class GroupTypeModel extends Model {
  @attr name;

  @hasMany("group", { inverse: "type", async: true }) groups;
}
