import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { useTask } from "ember-resources";

import getAvailableFieldsForFieldQuery from "@projectcaluma/ember-analytics/gql/queries/get-available-fields-for-field.graphql";

export default class CaFieldSelectorListCaFieldFunctionSelectComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked aggregationFunctions = useTask(
    this,
    this.getAggregationFunctions,
    () => [this.args.field, this.args.tableSlug]
  );

  @task
  *getAggregationFunctions() {
    try {
      // Get the base path without the field so we can fetch the necessary fields later on.
      const pathList = this.args.field.dataSource.split(".");
      const prefix = pathList.slice(0, -1).join(".");
      const options = yield this.apollo.query(
        {
          query: getAvailableFieldsForFieldQuery,
          variables: {
            slug: this.args.tableSlug,
            prefix,
          },
        },
        "analyticsTable.availableFields"
      );
      const fields = options.edges.map((edge) => edge.node);
      const field = fields.find(
        (field) => field.sourcePath === this.args.field.dataSource
      );
      return field?.supportedFunctions ?? [];
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("caluma.analytics.notification.fetch-error")
      );
    }
  }
}
