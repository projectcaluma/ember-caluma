import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { trackedFunction } from "ember-resources/util/function";

import allFormsForQuestionQuery from "@projectcaluma/ember-form-builder/gql/queries/all-forms-for-question.graphql";

export default class CfbFormEditorQuestionUsage extends Component {
  @service intl;
  @queryManager apollo;

  @tracked modalVisible = false;
  @tracked _forms = null;

  get title() {
    return this.intl.t("caluma.form-builder.question.usage.title", {
      n: this.otherForms,
      // for highlighting the number we use the <b> tag
      htmlSafe: true,
    });
  }

  get otherForms() {
    return this.forms.value?.length - 1 ?? 0;
  }

  forms = trackedFunction(this, async () => {
    if (!this.args.slug) {
      // The shown question hasn't completely loaded yet
      return [];
    }
    if (this._forms) {
      // we have already fetched the forms previously
      return this._forms;
    }

    try {
      const forms = await this.apollo.query(
        {
          query: allFormsForQuestionQuery,
          variables: {
            slug: this.args.slug,
          },
          fetchPolicy: "no-cache",
        },
        "allForms.edges",
      );

      this._forms = forms; // cache the result

      return forms;
    } catch (error) {
      console.error(error);
      return { value: [] };
    }
  });
}
