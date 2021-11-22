import { action } from "@ember/object";
import { debounce } from "@ember/runloop";
import Component from "@glimmer/component";

import FieldValidations from "@projectcaluma/ember-analytics/validations/field";

export default class CaFieldDetailsComponent extends Component {
  Validations = FieldValidations;

  @action
  async update(key, value, changeset) {
    changeset.set(key, value);
    await changeset.validate();

    if (changeset.isValid) {
      debounce(this, this.updateField, { [key]: value }, 1000);
    }
  }

  updateField(prop) {
    this.args.onUpdate(prop);
  }
}
