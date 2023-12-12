import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class ApplicationRoute extends Route {
  @service intl;

  @navigationTitle
  get title() {
    return this.intl.t("caluma.form-builder.form.allForms");
  }
}
