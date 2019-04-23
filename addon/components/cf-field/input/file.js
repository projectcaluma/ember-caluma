import Component from "@ember/component";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";

import getFileAnswerInfoQuery from "ember-caluma/gql/queries/get-fileanswer-info";
import layout from "../../../templates/components/cf-field/input/file";

export default Component.extend({
  layout,
  tagName: "",

  intl: service(),
  apollo: service(),

  downloadUrl: reads("field.answer.fileValue.downloadUrl"),

  placeholder: computed("field.answer.fileValue", function() {
    return this.get("field.answer.fileValue")
      ? this.intl.t("caluma.form.changeFile")
      : this.intl.t("caluma.form.selectFile");
  }),

  actions: {
    async download() {
      const { downloadUrl } = await this.apollo.watchQuery(
        {
          query: getFileAnswerInfoQuery,
          variables: { id: this.field.answer.id },
          fetchPolicy: "cache-and-network"
        },
        "node.fileValue"
      );

      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
    },

    async save({ target }) {
      const file = target.files[0];

      if (!file) {
        return;
      }

      const saved = await this.onSave(file.name);

      const data = new FormData();
      data.append("file", file);

      const request = new XMLHttpRequest();
      request.open("PUT", saved.fileValue.uploadUrl);
      request.send(file);
      request.onload = event => {
        if (event.target.status == 200) {
          target.parentNode.querySelector("[type=text]").value = "";
        }
      };
    }
  }
});
