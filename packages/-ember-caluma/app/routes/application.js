import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

import ENV from "ember-caluma/config/environment";

export default class ApplicationRoute extends Route {
  @service intl;
  @service calumaOptions;

  beforeModel() {
    this.intl.setLocale("en");

    if (ENV.environment !== "production") {
      this.calumaOptions.registerComponentOverride({
        label: this.intl.t(
          "caluma.form-builder.question.widgetOverrides.dummy-one"
        ),
        component: "dummy-one",
        types: ["TextQuestion", "TextareaQuestion"],
      });

      this.calumaOptions.registerComponentOverride({
        label: this.intl.t(
          "caluma.form-builder.question.widgetOverrides.dummy-two"
        ),
        component: "dummy-two",
      });
    }
  }
}
