import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { ensureSafeComponent } from "@embroider/util";
import Component from "@glimmer/component";
import PowerSelectComponent from "ember-power-select/components/power-select";
import PowerSelectMultipleComponent from "ember-power-select/components/power-select-multiple";

/**
 * Dropdown component for the comparison of powerselect single and multiple choice question type
 *
 * @class CfFieldInputPowerselectCompareComponent
 * @argument {Field} field The field for this input type
 */
export default class CfFieldInputPowerselectCompareComponent extends Component {
  @service intl;

  get multiple() {
    return this.args.field?.question.isMultipleChoice;
  }

  get selectComponent() {
    return ensureSafeComponent(
      this.multiple ? PowerSelectMultipleComponent : PowerSelectComponent,
      this,
    );
  }

  @action
  change() {
    // ignored, but element needs an action to prevent errors.
  }
}
