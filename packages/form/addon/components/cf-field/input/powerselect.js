import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

/**
 * Dropdown component for the single and multiple choice question type
 *
 * @class CfFieldInputPowerSelectComponent
 * @argument {Field} field The field for this input type
 */
export default class CfFieldInputPowerselectComponent extends Component {
  @service intl;

  get multiple() {
    return this.args.field?.question.isMultipleChoice;
  }

  get componentName() {
    return this.multiple ? "power-select-multiple" : "power-select";
  }

  get searchEnabled() {
    const config = getOwner(this).resolveRegistration("config:environment");
    const { powerSelectEnableSearchLimit = 10 } = config["ember-caluma"] || {};

    return this.args.field?.options?.length > powerSelectEnableSearchLimit;
  }

  get placeholder() {
    const suffix = this.multiple ? "multiple" : "single";
    return this.intl.t(`caluma.form.power-select.placeholder-${suffix}`);
  }

  @action
  change(choices) {
    let value = null;

    if (Array.isArray(choices)) {
      value = choices.map((choice) => choice.slug);
    } else if (choices !== null) {
      value = choices.slug;
    }
    // ELSE will never be taken as long as we don't allow for empty
    // selections in single choice fields. Empty selections must first be
    // implemented/allowed by the backend.

    this.args.onSave(value);
  }
}
