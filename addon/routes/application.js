import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { t } from "ember-intl";

import NavigationRouteMixin from "ember-caluma/mixins/navigation-route";

export default class ApplicationRoute extends Route.extend(
  NavigationRouteMixin
) {
  @service intl;
  @t("caluma.form-builder.form.allForms") title;
}
