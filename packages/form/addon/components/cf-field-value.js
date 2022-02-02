import { action } from "@ember/object";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";

import getFileAnswerInfoQuery from "@projectcaluma/ember-form/gql/queries/fileanswer-info.graphql";

export default class CfFieldValueComponent extends Component {
  @queryManager apollo;

  @action
  async download(id) {
    const { downloadUrl } = await this.apollo.query(
      { query: getFileAnswerInfoQuery, variables: { id } },
      "node.fileValue"
    );

    window.open(downloadUrl, "_blank");
  }
}
