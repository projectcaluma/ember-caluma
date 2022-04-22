import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import {
  dropTask,
  enqueueTask,
  restartableTask,
  lastValue,
} from "ember-concurrency-decorators";
import { useTask, useResource } from "ember-resources";

import removeAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-table.graphql";
import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";
import getAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-table.graphql";
import FetchAnalyticsTableResource from "@projectcaluma/ember-analytics/resources/analytics-table";

export default class CaReportBuilderComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;
  @service router;

  get isNew() {
    return !this.args.analyticsTable?.id;
  }

  get formDisabled() {
    return !this.isNew;
  }

  get startingObjects() {
    // TODO: Replace with dynamic list
    // return this.args.startingObjects;
    return [{ label: "Cases", value: "CASES" }];
  }

  @dropTask
  *createTable() {
    try {
      this.args.analyticsTable.execute();
      const data = this.args.analyticsTable.data;
      const input = {
        slug: data.slug,
        name: data.name,
        startingObject: data.startingObject,
      };
      const answer = yield this.apollo.mutate(
        {
          mutation: saveAnalyticsTableMutation,
          fetchPolicy: "network-only",
          variables: {
            input,
          },
        },
        "saveAnalyticsTable.analyticsTable"
      );
      yield this.args.onAdd?.(
        this.args.analyticsTable.slug,
        this.args.analyticsTable.startingObject
      );
      this.router.transitionTo("reports.edit", data.slug);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.create_error`)
      );
    }
  }

  @dropTask
  *deleteTable() {
    try {
      yield this.apollo.mutate({
        mutation: removeAnalyticsTableMutation,
        fetchPolicy: "network-only",
        variables: {
          input: {
            slug: this.args.analyticsTable.slug,
          },
        },
      });
      this.router.transitionTo("reports");
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.delete_error`)
      );
    }
  }
}
