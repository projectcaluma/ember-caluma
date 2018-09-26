import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { translationMacro as t } from "ember-intl";
import NavigationRouteMixin from "ember-caluma-form-builder/mixins/navigation-route";

export default Route.extend(NavigationRouteMixin, {
  intl: service(),

  title: t("caluma.form-builder.form.all")
});
