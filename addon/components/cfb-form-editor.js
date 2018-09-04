import Component from "@ember/component";
import layout from "../templates/components/cfb-form-editor";
import { task } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import formEditorQuery from "ember-caluma-form-builder/gql/queries/form-editor";

export default Component.extend(ComponentQueryManager, {
  layout,

  didReceiveAttrs() {
    this._super(...arguments);

    this.get("data").perform();
  },

  data: task(function*() {
    if (!this.get("slug")) {
      return null;
    }

    return yield this.get("apollo").watchQuery(
      {
        query: formEditorQuery,
        variables: { id: btoa(`Form:${this.get("slug")}`) },
        fetchPolicy: "cache-and-network"
      },
      "node"
    );
  }).restartable()
});
