import { setOwner } from "@ember/application";
import { inject as service } from "@ember/service";

import HiddenComponent from "@projectcaluma/ember-form/components/cf-field/input/hidden";
import PowerSelectComponent from "@projectcaluma/ember-form/components/cf-field/input/powerselect";

class HiddenOverride {
  @service intl;

  get label() {
    return this.intl.t("caluma.form-builder.question.widgetOverrides.hidden");
  }

  component = "cf-field/input/hidden";
  componentClass = HiddenComponent;
}

class PowerSelectOverride {
  @service intl;

  get label() {
    return this.intl.t(
      "caluma.form-builder.question.widgetOverrides.powerselect",
    );
  }

  component = "cf-field/input/powerselect";
  componentClass = PowerSelectComponent;
  types = [
    "ChoiceQuestion",
    "MultipleChoiceQuestion",
    "DynamicChoiceQuestion",
    "DynamicMultipleChoiceQuestion",
  ];
}

export function initialize(appInstance) {
  const options = appInstance.lookup("service:caluma-options");

  const hiddenOverride = new HiddenOverride();
  const powerSelectOverride = new PowerSelectOverride();

  setOwner(hiddenOverride, appInstance);
  setOwner(powerSelectOverride, appInstance);

  options.registerComponentOverride(hiddenOverride);
  options.registerComponentOverride(powerSelectOverride);
}

export default {
  initialize,
};
