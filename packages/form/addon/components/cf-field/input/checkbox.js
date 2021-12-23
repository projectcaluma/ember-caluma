import { action } from "@ember/object";
import Component from "@glimmer/component";

/**
 * Input component for the checkbox question type
 *
 * @class CfFieldInputCheckboxComponent
 * @argument {Field} field The field for this input type
 */
export default class CfFieldInputCheckboxComponent extends Component {
  /**
   * Update the value of the field with the slugs of the currently checked
   * boxes.
   *
   * @method update
   */
  @action
  update({ target: { value, checked } }) {
    const valueSet = new Set(this.args.field.value);

    if (checked) {
      valueSet.add(value);
    } else {
      valueSet.delete(value);
    }

    this.args.onSave([...valueSet]);
  }
}
