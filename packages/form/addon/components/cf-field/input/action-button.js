import { assert } from "@ember/debug";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { dependencySatisfies, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";

let CfFieldInputActionButtonComponent;

if (macroCondition(dependencySatisfies("@projectcaluma/ember-workflow", ""))) {
  CfFieldInputActionButtonComponent = class extends Component {
    @service modal;

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

      return !confirmText || this.modal.confirm(confirmText);
    }

    @action
    onSuccess() {
      return this.args.context?.actionButtonOnSuccess?.();
    }

    @action
    onError(error) {
      return this.args.context?.actionButtonOnError?.(error);
    }
  };
} else {
  CfFieldInputActionButtonComponent = class extends Component {
    constructor(...args) {
      super(...args);

      assert(
        "@projectcaluma/ember-workflow must be installed to enable the usage of the action button questions"
      );
    }
  };
}

export default CfFieldInputActionButtonComponent;
