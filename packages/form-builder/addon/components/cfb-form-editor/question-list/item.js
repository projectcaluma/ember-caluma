import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { service } from "@ember/service";
import Component from "@glimmer/component";

import { hasQuestionType } from "@projectcaluma/ember-core/helpers/has-question-type";

const cleanJexl = (expr) => expr.replace(/\s/g, "");

export default class CfbFormEditorQuestionListItem extends Component {
  @service router;

  get elementId() {
    return guidFor(this);
  }

  get required() {
    return this.requiredType !== "not-required";
  }

  get requiredType() {
    const required = cleanJexl(this.args.question?.isRequired ?? "");

    return required === "true"
      ? "required"
      : required === "false"
        ? "not-required"
        : "conditional";
  }

  get hidden() {
    return this.hiddenType !== "not-hidden";
  }

  get hiddenType() {
    const hidden = cleanJexl(this.args.question?.isHidden ?? "");

    return hidden === "true"
      ? "hidden"
      : hidden === "false"
        ? "not-hidden"
        : "conditional";
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
