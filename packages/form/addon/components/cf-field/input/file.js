import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";

import removeAnswerMutation from "@projectcaluma/ember-form/gql/mutations/remove-answer.graphql";
import getFileAnswerInfoQuery from "@projectcaluma/ember-form/gql/queries/fileanswer-info.graphql";

export default class CfFieldInputFileComponent extends Component {
  @service intl;

  @queryManager apollo;

  get downloadUrl() {
    return this.args.field?.answer?.value?.downloadUrl;
  }

  get downloadName() {
    return this.args.field?.answer?.value?.name;
  }

  @action
  async download() {
    const { downloadUrl } = await this.apollo.watchQuery(
      {
        query: getFileAnswerInfoQuery,
        variables: { id: this.args.field.answer.id },
        fetchPolicy: "cache-and-network",
      },
      "node.fileValue"
    );

    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  }

  @action
  async save({ target }) {
    const file = target.files[0];

    if (!file) {
      return;
    }

    const { fileValue } = await this.args.onSave(file.name);

    try {
      const response = await fetch(fileValue.uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (!response.ok) {
        throw new Error();
      }

      // eslint-disable-next-line ember/classic-decorator-no-classic-methods
      set(this.args.field.answer, "value", {
        name: file.name,
        downloadUrl: fileValue.downloadUrl,
      });
    } catch (error) {
      await this.args.onSave(null);
      // eslint-disable-next-line ember/classic-decorator-no-classic-methods
      set(this.args.field, "_errors", [{ type: "uploadFailed" }]);
    } finally {
      // eslint-disable-next-line require-atomic-updates
      target.value = "";
    }
  }

  @action
  async delete() {
    try {
      await this.apollo.mutate({
        mutation: removeAnswerMutation,
        variables: {
          input: {
            answer: this.args.field.answer.uuid,
          },
        },
      });

      await this.args.onSave(null);
    } catch (error) {
      set(this.args.field, "_errors", [{ type: "deleteFailed" }]);
    }
  }
}
