import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

/**
 * Input component for the checkbox question type
 *
 * @class CfFieldInputCheckboxComponent
 * @argument {Field} field The field for this input type
 */
export default class CfFieldInputCheckboxComponent extends Component {
  @tracked selected = this.args.field.value;

  /**
   * Update the value of the field with the slugs of the currently checked
   * boxes.
   *
   * @method update
   */
  @action
  update({ target: { value, checked } }) {
    const valueSet = new Set(this.selected);

    if (checked) {
      valueSet.add(value);
    } else {
      valueSet.delete(value);
    }

    this.selected = [...valueSet];
    this.args.onSave(this.selected);
  }
}
