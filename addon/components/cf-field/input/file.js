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

  downloadUrl: reads("field.answer.value.downloadUrl"),
  downloadName: reads("field.answer.value.name"),

  placeholder: computed("field.answer.value", function() {
    return this.get("field.answer.value")
      ? this.intl.t("caluma.form.changeFile")
      : this.intl.t("caluma.form.selectFile");
  }),

  /**
   * Promise wrapper around XHMLHttpRequest
   *
   * @param {File} file The file to upload.
   * @param {String} url The MinIO uploadUrl
   * @return {Promise<Event>} A promise resolving or rejecting with the event.
   * @method _uploadFile
   * @private
   */
  _uploadFile(file, url) {
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
  },

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
        await this._uploadFile(file, fileValue.uploadUrl);

        this.set("field.answer.value", {
          name: file.name,
          downloadUrl: fileValue.downloadUrl
        });
      } catch (event) {
        await this.onSave(null);
        this.set("field._errors", [{ type: "uploadFailed" }]);
      } finally {
        // eslint-disable-next-line require-atomic-updates
        target.value = "";
        target.parentNode.querySelector("[type=text]").value = "";
      }
    }
  }
});
