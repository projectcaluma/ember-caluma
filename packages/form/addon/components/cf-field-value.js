import { action } from "@ember/object";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";

import getFilesAnswerInfoQuery from "@projectcaluma/ember-form/gql/queries/filesanswer-info.graphql";

export default class CfFieldValueComponent extends Component {
  @queryManager apollo;

  @action
  async download(id) {
    const files = await this.apollo.query(
      {
        query: getFilesAnswerInfoQuery,
        variables: { id: this.args.field.answer.raw.id },
        fetchPolicy: "network-only",
      },
      "node.value"
    );

    const { downloadUrl } = files?.find((file) => file.id === id) ?? {};
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  }
}
