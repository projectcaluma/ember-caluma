import Helper from "@ember/component/helper";
import { warn } from "@ember/debug";
import { inject as service } from "@ember/service";

import CalumaOptionsService from "@projectcaluma/ember-core/services/caluma-options";
import Form from "@projectcaluma/ember-form/lib/form";
import Question from "@projectcaluma/ember-form/lib/question";

/**
 * Helper for getting the right widget.
 *
 * This helper expects n objects as positional parameters. It checks if the
 * object has a widget override in it's metadata. If one exists it checks if
 * said widget was registered in the caluma options service and then returns
 * the widget name. If it doesn't have a valid widget, the next object will be
 * checked. If no object returns a valid widget, the passed default widget will
 * be used.
 *
 * ```hbs
 * {{component (get-widget field.question someobject default="cf-form") foo=bar}}
 * ```
 */
export default class GetWidgetHelper extends Helper {
  @service declare calumaOptions: CalumaOptionsService;

  compute(
    params: (Question | Form)[],
    { default: defaultWidget = "cf-field/input" }: { default: string }
  ): string {
    for (const obj of params) {
      const widget = obj?.raw?.meta?.widgetOverride;

      if (!widget) {
        continue;
      }

      const override = this.calumaOptions
        .getComponentOverrides()
        .find(({ component }) => component === widget);

      warn(
        `Widget override "${widget}" is not registered. Please register it by calling \`calumaOptions.registerComponentOverride\``,
        override !== undefined,
        { id: "ember-caluma.unregistered-override" }
      );

      if (override) return widget;
    }

    return defaultWidget;
  }
}
