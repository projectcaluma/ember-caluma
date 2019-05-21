import Helper from "@ember/component/helper";
import { inject as service } from "@ember/service";
import { warn } from "@ember/debug";

/**
 * Helper for getting the right widget for a field.
 *
 * This helper expects a field as first positional parameter. It checks if the
 * field has a widget override in it's metadata. If one exists it checks if
 * said widget was registered in the caluma options service and then returns
 * the widget name.
 *
 * ```hbs
 * {{component (get-widget field default="cf-form") foo=bar}}
 * ```
 *
 * @function getWidget
 * @param {Array} params
 * @param {Object} [options]
 * @param {String} [options.default]
 */
export default Helper.extend({
  calumaOptions: service(),

  compute([field], { default: defaultWidget = "cf-field/input" }) {
    try {
      const widget = field.question.meta.widgetOverride;
      const overrides = this.calumaOptions.getComponentOverrides();
      const override = overrides.find(({ component }) => component === widget);

      if (!override) {
        warn(
          `Widget override "${widget}" is not registered. Please register it by calling \`calumaOptions.registerComponentOverride\``,
          !widget,
          { id: "ember-caluma.unregistered-override" }
        );

        throw new Error();
      }

      return widget;
    } catch (e) {
      return defaultWidget;
    }
  }
});
