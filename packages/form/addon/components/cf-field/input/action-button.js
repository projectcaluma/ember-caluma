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
    return this.args.field.question.raw.action.toLowerCase();
  }

  get color() {
    return this.args.field.question.raw.color.toLowerCase();
  }

  get type() {
    return this.args.field.question.raw.action === "COMPLETE"
      ? "submit"
      : "button";
  }

  get validateOnEnter() {
    return (
      this.args.field.question.raw.action === "COMPLETE" &&
      this.args.field.question.raw.validateOnEnter
    );
  }

  @action
  async beforeMutate(validateFn) {
    if (
      this.args.field.question.raw.action === "COMPLETE" &&
      !(await validateFn())
    ) {
      return false;
    }

    const confirmText = this.args.field.question.raw.infoText;

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
