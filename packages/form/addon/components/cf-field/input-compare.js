import { service } from "@ember/service";
import { ensureSafeComponent } from "@embroider/util";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";

import { parseWidgetType } from "@projectcaluma/ember-form/lib/parsers";

/**
 * Component for wrapping the compare input components
 *
 * @class CfFieldInputCompareComponent
 */
export default class CfFieldInputCompareComponent extends Component {
  @service calumaOptions;

  /**
   * The compare input options.
   *
   * @property {} compareOptions
   * @accessor
   */
  get compareOptions() {
    const { widget } = parseWidgetType(this.calumaOptions, [
      this.args.field.question,
    ]);

    const override = this.calumaOptions
      .getComponentOverrides()
      .find(({ component }) => component === widget);

    if (widget === "cf-field/input") {
      const typeName = this.args.field?.question?.raw?.__typename;
      const compareOptions = {
        TextQuestion: { combined: true },
        IntegerQuestion: { combined: true },
        MultipleChoiceQuestion: { combined: true },
        ChoiceQuestion: { combined: true },
        DateQuestion: { combined: true },
        TextareaQuestion: { combined: true },
        TableQuestion: { combined: true, disableChangesNote: true },
      };

      if (typeName in compareOptions) {
        return compareOptions[typeName];
      }
    }

    return override?.compareOptions;
  }

  /**
   * The compare component registered for the input type.
   *
   * @property {Component} compareComponent
   * @accessor
   */
  get compareComponent() {
    return this.compareOptions
      ? ensureSafeComponent(this.compareOptions.component, this)
      : null;
  }

  /**
   * In comparison mode, never perform a save, but keep a method
   * to bind to the components.
   *
   * @method save
   * @param {String|Number|String[]} value The new value to save to the field
   */
  save = task({ restartable: true }, async (value) => {
    return value;
  });
}
