import { ensureSafeComponent } from "@embroider/util";
import Component from "@glimmer/component";

import ActionButtonComponent from "@projectcaluma/ember-form/components/cf-field/input/action-button";
import CheckboxComponent from "@projectcaluma/ember-form/components/cf-field/input/checkbox";
import DateComponent from "@projectcaluma/ember-form/components/cf-field/input/date";
import FileComponent from "@projectcaluma/ember-form/components/cf-field/input/file";
import FloatComponent from "@projectcaluma/ember-form/components/cf-field/input/float";
import IntegerComponent from "@projectcaluma/ember-form/components/cf-field/input/integer";
import RadioComponent from "@projectcaluma/ember-form/components/cf-field/input/radio";
import StaticComponent from "@projectcaluma/ember-form/components/cf-field/input/static";
import TableComponent from "@projectcaluma/ember-form/components/cf-field/input/table";
import TextComponent from "@projectcaluma/ember-form/components/cf-field/input/text";
import TextareaComponent from "@projectcaluma/ember-form/components/cf-field/input/textarea";

const COMPONENT_MAPPING = {
  ActionButtonQuestion: ActionButtonComponent,
  CalculatedFloatQuestion: FloatComponent,
  ChoiceQuestion: RadioComponent,
  DateQuestion: DateComponent,
  DynamicChoiceQuestion: RadioComponent,
  DynamicMultipleChoiceQuestion: CheckboxComponent,
  FileQuestion: FileComponent,
  FloatQuestion: FloatComponent,
  IntegerQuestion: IntegerComponent,
  MultipleChoiceQuestion: CheckboxComponent,
  StaticQuestion: StaticComponent,
  TableQuestion: TableComponent,
  TextareaQuestion: TextareaComponent,
  TextQuestion: TextComponent,
};

/**
 * Component for wrapping the input components
 *
 * @class CfFieldInputComponent
 */
export default class CfFieldInputComponent extends Component {
  /**
   * The input component
   *
   * @property {Component} inputComponent
   * @accessor
   */
  get inputComponent() {
    const typename = this.args.field?.question.raw.__typename;

    return ensureSafeComponent(COMPONENT_MAPPING[typename], this);
  }
}
