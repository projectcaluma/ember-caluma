import Component from "@ember/component";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";

import getFileAnswerInfoQuery from "ember-caluma/gql/queries/get-fileanswer-info";
import layout from "../../../templates/components/cf-field/input/file";

/**
 * Promise wrapper around XHMLHttpRequest
 *
 * @param {File} file The file to upload.
 * @param {String} url The MinIO uploadUrl
 * @return {Promise<Event>} A promise resolving or rejecting with the event.
 */
function uploadFile(file, url) {
  return new Promise((resolve, reject) => {
    const data = new FormData();
    data.append("file", file);

    const request = new XMLHttpRequest();

    request.addEventListener("error", event => reject(event));
    request.addEventListener("abort", event => reject(event));
    request.addEventListener("load", event => {
      if (event.target.status == 200) {
        resolve(event);
      } else {
        reject(event);
      }
    });

    request.open("PUT", url);
    request.send(file);
  });
}

export default Component.extend({
  layout,
  tagName: "",

  intl: service(),
  apollo: service(),

  downloadUrl: reads("field.answer.fileValue.downloadUrl"),
  downloadName: reads("field.answer.fileValue.name"),

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

      const { fileValue } = await this.onSave(file.name);

      try {
        await uploadFile(file, fileValue.uploadUrl);

        this.set("field.answer.fileValue", {
          name: file.name,
          downloadUrl: fileValue.downloadUrl
        });
      } catch (event) {
        this.set("field._errors", [{ type: "uploadFailed" }]);
        this.set("field.answer.fileValue", null);
      } finally {
        target.value = "";
        target.parentNode.querySelector("[type=text]").value = "";
      }
    }
  }
});
