import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import fetch from "fetch";

import getFilesAnswerInfoQuery from "@projectcaluma/ember-form/gql/queries/filesanswer-info.graphql";

export default class CfFieldInputFilesComponent extends Component {
  @service intl;

  @queryManager apollo;

  get files() {
    return this.args.field?.answer?.value;
  }

  @action
  async download(fileId) {
    if (!fileId) {
      return;
    }
    const answers = await this.apollo.query(
      {
        query: getFilesAnswerInfoQuery,
        variables: { id: this.args.field.answer.raw.id },
        fetchPolicy: "network-only",
      },
      "node.value",
    );
    const { downloadUrl } =
      answers.find((file) =>
        // the testing graph-ql setup does a base64 encoding of `__typename: fileID`
        macroCondition(isTesting())
          ? file.id === fileId ||
            atob(file.id).substring(file.__typename.length + 1) === fileId
          : file.id === fileId,
      ) ?? {};
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  }

  @action
  async save({ target }) {
    // store the old list of files
    // unwrap files from FileList construct
    let newFiles = Array.from(target.files).map((file) => ({
      name: file.name,
      value: file,
    }));

    const fileList = [...(this.files || []), ...newFiles];

    if (newFiles.length === 0) {
      return;
    }

    // trigger save action for file list of old and new files with
    // reduces properties to match gql format
    const { filesValue: savedAnswerValue } = await this.args.onSave(
      fileList.map(({ name, id }) => ({ name, id })),
    );

    try {
      // iterate over list of new files and enrich with graphql answer values
      newFiles = newFiles.map((file) => ({
        ...savedAnswerValue.find(
          (value) =>
            file.name === value.name &&
            !fileList.find((file) => file.id === value.id),
        ),
        value: file.value,
      }));

      const uploadFunction = async (file) => {
        const response = await fetch(file.uploadUrl, {
          method: "PUT",
          body: file.value,
        });
        if (!response.ok) {
          throw new Error();
        }
        return response;
      };

      // upload the actual file to data storage
      await Promise.all(newFiles.map((file) => uploadFunction(file)));

      this.args.field.answer.value = savedAnswerValue;
    } catch {
      await this.args.onSave([]);
      this.args.field._errors = [{ type: "uploadFailed" }];
    } finally {
      target.value = "";
    }
  }

  @action
  async delete(fileId) {
    const remainingFiles = this.files
      .filter((file) => file.id !== fileId)
      .map(({ name, id }) => ({ name, id }));

    try {
      await this.args.onSave(remainingFiles);
    } catch {
      this.args.field._errors = [{ type: "deleteFailed" }];
    }
  }
}
