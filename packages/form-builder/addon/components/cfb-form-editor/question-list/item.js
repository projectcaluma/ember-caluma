import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import jexl from "jexl";

import { hasQuestionType } from "@projectcaluma/ember-core/helpers/has-question-type";

export default class CfbFormEditorQuestionListItem extends Component {
  @service router;

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

  get isActive() {
    // we can't access this.router.applicationRouter.currentRoute.queryParams
    // because it is non-reactive
    return this.router.currentURL?.endsWith(
      `/questions/${this.args.question.slug}`,
    );
  }

  @action
  editQuestion(question, e) {
    e.preventDefault();
    this.args.onEditQuestion?.(question);
  }

  @action
  clickForm(form, e) {
    e.preventDefault();
    this.args.onClickForm?.(form);
  }
}
