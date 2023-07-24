import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { trackedFunction } from "ember-resources/util/function";

import allFormsForQuestionQuery from "@projectcaluma/ember-form-builder/gql/queries/all-forms-for-question.graphql";

export default class CfbFormEditorQuestionUsage extends Component {
  @tracked modalVisible = false;
  @queryManager apollo;

  forms = trackedFunction(this, async () => {
    if (!this.modalVisible) {
      return null;
    }

    const forms = await this.apollo.query(
      {
        query: allFormsForQuestionQuery,
        variables: {
          slug: this.args.model.slug,
        },
      },
      "allForms.edges",
    );

    return forms;
  });
}
