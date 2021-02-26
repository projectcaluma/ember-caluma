import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { t } from "ember-intl";

import { navigationTitle } from "ember-caluma/decorators";

export default class EditQuestionsNewRoute extends Route {
  @service intl;

  @navigationTitle
  @t("caluma.form-builder.question.new")
  title;

  model() {
    return this.modelFor("edit");
  }
}
