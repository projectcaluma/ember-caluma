import { assert } from "@ember/debug";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import UIkit from "uikit";

async function confirm(text) {
  try {
    await UIkit.modal.confirm(text);

    return true;
  } catch (error) {
    return false;
  }
}

export default class CfFieldInputActionButtonComponent extends Component {
  constructor(...args) {
    super(...args);

    assert(
      "The document must have a `workItemUuid` for `<CfField::Input::ActionButton />` to work.",
      this.args.field.document.workItemUuid
    );
  }

  get workItem() {
    return (
      this.args.context?.actionButtonWorkItemId ||
      this.args.field.document.workItemUuid
    );
  }

  get action() {
    return this.args.field.question.action.toLowerCase();
  }

  get color() {
    return this.args.field.question.color.toLowerCase();
  }

  get type() {
    return this.args.field.question.action === "COMPLETE" ? "submit" : "button";
  }

  get validateOnEnter() {
    return (
      this.args.field.question.action === "COMPLETE" &&
      this.args.field.question.validateOnEnter
    );
  }

  @action
  async beforeMutate(validateFn) {
    if (
      this.args.field.question.action === "COMPLETE" &&
      !(await validateFn())
    ) {
      return false;
    }

    const confirmText = this.args.field.question.infoText;

    return !confirmText || confirm(confirmText);
  }

  @action
  onSuccess() {
    return this.args.context?.actionButtonOnSuccess?.();
  }

  @action
  onError(error) {
    return this.args.context?.actionButtonOnError?.(error);
  }
}
