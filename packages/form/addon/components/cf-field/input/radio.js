import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CfFieldInputRadioComponent extends Component {
  @tracked checkedValue = this.args.field.answer.value;
  reset = "Reset";
  isQuestionRequired = "false";

  @action
  updatSelection({ target: { value, checked } }) {
    if (this.args.field.question.raw.isRequired === "false" && checked) {
      this.checkedValue = value;
    } else if (this.args.field.question.raw.isRequired === "true") {
      this.args.onSave(value);
    } else {
      this.args.onSave(null);
    }
  }

  @action
  resetSelected() {
    const select = document.getElementById(this.checkedValue);
    select.checked = false;
    this.checkedValue = null;
    this.args.onSave(null);
  }
}
