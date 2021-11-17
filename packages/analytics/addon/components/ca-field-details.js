import { action } from "@ember/object";
import Component from "@glimmer/component";

import FieldValidations from "@projectcaluma/ember-analytics/validations/field";

export default class CaFieldDetailsComponent extends Component {
  Validations = FieldValidations;

  @action
  update(key, value) {
    this.args.onUpdate({ [key]: value });
  }
}
