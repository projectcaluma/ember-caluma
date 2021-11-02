import { dasherize } from "@ember/string";
import Component from "@glimmer/component";

const mapping = {
  MultipleChoiceQuestion: "checkbox",
  ChoiceQuestion: "radio",
  DynamicMultipleChoiceQuestion: "checkbox",
  DynamicChoiceQuestion: "radio",
  CalculatedFloatQuestion: "float",
};

/**
 * Component for wrapping the input components
 *
 * @class CfFieldInputComponent
 */
export default class CfFieldInputComponent extends Component {
  /**
   * The input component type
   *
   * @property {String} type
   * @accessor
   */
  get type() {
    const typename = this.args.field?.question.__typename;

    return (
      typename &&
      (mapping[typename] || dasherize(typename.replace(/Question$/, "")))
    );
  }
}
