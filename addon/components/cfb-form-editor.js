import Component from "@ember/component";
import layout from "../templates/components/cfb-form-editor";
import { task } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";

import formEditorQuery from "ember-caluma-form-builder/gql/queries/form-editor";

export default Component.extend(ComponentQueryManager, {
  layout,

  intl: service(),

  add: false,

  didReceiveAttrs() {
    this._super(...arguments);

    this.get("data").perform();
  },

  formId: computed("slug", function() {
    return btoa(`Form:${this.get("slug")}`);
  }),

  data: task(function*() {
    if (!this.get("slug")) {
      return null;
    }

    return yield this.get("apollo").watchQuery({
      query: formEditorQuery,
      variables: { id: this.get("formId") },
      fetchPolicy: "cache-and-network"
    });
  }).restartable()
});
