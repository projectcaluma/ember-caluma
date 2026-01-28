import { setOwner } from "@ember/application";
import { inject as service } from "@ember/service";

import HiddenComponent from "@projectcaluma/ember-form/components/cf-field/input/hidden";
import NumberSeparatorComponent from "@projectcaluma/ember-form/components/cf-field/input/number-separator";
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
  compareOptions = {
    combined: false,
  };
}

class NumberSeparatorOverride {
  @service intl;

  get label() {
    return this.intl.t(
      "caluma.form-builder.question.widgetOverrides.number-separator",
    );
  }

  component = "cf-field/input/number-separator";
  componentClass = NumberSeparatorComponent;
  types = ["IntegerQuestion", "FloatQuestion", "CalculatedFloatQuestion"];
  compareOptions = {
    combined: true,
  };
}

export function initialize(appInstance) {
  const options = appInstance.lookup("service:caluma-options");

  [HiddenOverride, PowerSelectOverride, NumberSeparatorOverride].forEach(
    (cls) => {
      const override = new cls();
      setOwner(override, appInstance);
      options.registerComponentOverride(override);
    },
  );
}

export default {
  initialize,
};
