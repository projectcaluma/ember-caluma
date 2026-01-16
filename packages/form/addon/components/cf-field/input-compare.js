import { service } from "@ember/service";
import { ensureSafeComponent } from "@embroider/util";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";

import ChoiceCompareComponent from "@projectcaluma/ember-form/components/cf-field/input-compare/choice";
import DateCompareComponent from "@projectcaluma/ember-form/components/cf-field/input-compare/date";
import MultipleChoiceCompareComponent from "@projectcaluma/ember-form/components/cf-field/input-compare/multiple-choice";
import TableCompareComponent from "@projectcaluma/ember-form/components/cf-field/input-compare/table";
import TextDiffCompareComponent from "@projectcaluma/ember-form/components/cf-field/input-compare/text-diff";
import TextareaCompareComponent from "@projectcaluma/ember-form/components/cf-field/input-compare/textarea";
import { parseWidgetType } from "@projectcaluma/ember-form/lib/parsers";

/**
 * Component for wrapping the compare input components
 *
 * @class CfFieldInputCompareComponent
 */
export default class CfFieldInputCompareComponent extends Component {
  @service calumaOptions;

  get coreCompareInputs() {
    return {
      // default core input components:
      TextQuestion: {
        component: TextDiffCompareComponent,
        combined: true,
      },
      IntegerQuestion: {
        component: TextDiffCompareComponent,
        combined: true,
      },
      MultipleChoiceQuestion: {
        component: MultipleChoiceCompareComponent,
        combined: true,
      },
      ChoiceQuestion: {
        component: ChoiceCompareComponent,
        combined: true,
      },
      DateQuestion: {
        component: DateCompareComponent,
        combined: true,
      },
      TextareaQuestion: {
        component: TextareaCompareComponent,
        combined: true,
      },
      TableQuestion: {
        component: TableCompareComponent,
        combined: true,
        disableChangesNote: true,
      },
    };
  }

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
      return this.coreCompareInputs[this.args.field.question.raw.__typename];
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
