import { action } from "@ember/object";
import Component from "@glimmer/component";

/**
 * Function to extract the option slug out of an input element. This is needed
 * since IE11 does not properly set the `value` attribute but sets the value to
 * `on` if checked and `off` if not. So for all sane browsers we use the
 * `value` attribute but for IE11 we use the appended option slug to the field
 * id as the input elements `name` property.
 *
 * E.g: An element with
 * `name="Document:xxx-xxx:Question:some-question:Option:some-option"` will
 * return `some-option`.
 *
 * For further information about this bug see
 * https://github.com/emberjs/ember.js/issues/15203
 *
 * @function getSlug
 * @param {Element} element The html input element
 * @return {String} The option slug
 */
const getSlug = ({ value, name }) => {
  return ["on", "off"].includes(value) ? name.split(":").pop() : value;
};

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
  update({ target }) {
    const checkedBoxes = [
      ...target.parentNode.parentNode.querySelectorAll(
        "input[type=checkbox]:checked"
      ),
    ];

    this.args.onSave([...new Set(checkedBoxes.map(getSlug))]);
  }
}
