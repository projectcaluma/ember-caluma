import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import Component from "@glimmer/component";
import jexl from "jexl";

import { hasQuestionType } from "@projectcaluma/ember-core/helpers/has-question-type";

export default class CfbFormEditorQuestionListItem extends Component {
  get elementId() {
    return guidFor(this);
  }

  get required() {
    try {
      return jexl.evalSync(this.args.question?.isRequired);
    } catch (error) {
      return this.args.question?.isRequired;
    }
  }

  get requiredType() {
    const required = this.required;
    return required === true
      ? "required"
      : required
      ? "conditional"
      : "not-required";
  }

  get hidden() {
    try {
      return jexl.evalSync(this.args.question?.isHidden);
    } catch (error) {
      return this.args.question?.isHidden;
    }
  }

  get hiddenType() {
    const hidden = this.hidden;
    return hidden === true ? "hidden" : hidden ? "conditional" : "not-hidden";
  }

  get showFormLink() {
    const question = this.args.question;
    return (
      this.args.mode === "reorder" &&
      (hasQuestionType(question, "form") || hasQuestionType(question, "table"))
    );
  }

  @action
  editQuestion(question, e) {
    e.preventDefault();
    this.args["on-edit-question"]?.(question);
  }

  @action
  clickForm(form, e) {
    e.preventDefault();
    this.args["on-click-form"]?.(form);
  }
}
