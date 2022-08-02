import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager, getObservable } from "ember-apollo-client";
import { enqueueTask } from "ember-concurrency";

import removeAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-field.graphql";
import saveAnalyticsField from "@projectcaluma/ember-analytics/tasks/save-analytics-field";

export default class CaFieldSelectorListComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @enqueueTask saveField = saveAnalyticsField;

  get fields() {
    return (
      this.args.analyticsTable?.fields?.edges?.map((edge) => edge.node) ?? []
    );
  }

  @action
  async updateField(field, key, value) {
    const requiredInput = {
      id: field.id,
      alias: field.alias,
      dataSource: field.dataSource,
      function: field.function,
      table: this.args.analyticsTable.id,
    };
    await this.saveField.perform({
      ...requiredInput,
      [key]: value,
    });
  }

  @enqueueTask
  *removeAnalyticsField(id) {
    try {
      yield this.apollo.mutate({
        mutation: removeAnalyticsFieldMutation,
        variables: { input: { id } },
      });
      const observableQuery = getObservable(this.args.analyticsTable);
      yield observableQuery.refetch();
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("caluma.analytics.notification.delete-error")
      );
    }
  }
}
