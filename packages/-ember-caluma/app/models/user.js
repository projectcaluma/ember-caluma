import Model, { attr } from "@ember-data/model";

export default class UserModel extends Model {
  @attr firstName;
  @attr lastName;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
