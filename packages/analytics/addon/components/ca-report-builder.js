import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { dropTask, enqueueTask } from "ember-concurrency-decorators";

import removeAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-field.graphql";
import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";
import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";
import getAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-table.graphql";

class CaField {
  @tracked alias;
  @tracked filter;
  @tracked dataSource;
  @tracked show;
}

export default class CaReportBuilderComponent extends Component {
  @queryManager apollo;

  @tracked analyticsTable;
  @tracked field;
  @tracked startingObject;

  constructor(...args) {
    super(...args);

    this.field = new CaField();
  }

  get tableId() {
    return this.analyticsTable.id;
  }

  get analyticsFields() {
    return this.analyticsTable.fields.edges.map((edge) => edge.node);
  }

  get availableFields() {
    return this.analyticsTable.availableFields.edges.map((edge) => edge.node);
  }

  get availableStartingObjects() {
    return [{ label: "Cases", value: "CASES" }];
  }

  @action
  setStartingObject(value) {
    this.startingObject = value;
  }

  @action
  setFieldDescription({ alias, filter }) {
    this.field.alias = alias;
    this.field.filter = filter;
  }

  @action
  setFieldPath(path) {
    this.field.dataSource = path;
    this.field.alias = path ? path.substring(path.lastIndexOf(".") + 1) : "";
  }

  @dropTask
  *fetchData() {
    if (!this.args.slug) {
      // create new table
      this.analyticsTable = yield this.apollo.mutate(
        {
          mutation: saveAnalyticsTableMutation,
          fetchPolicy: "network-only",
          variables: {
            input: { name: "test", slug: "test", startingObject: "CASES" },
          },
        },
        "saveAnalyticsTable.analyticsTable"
      );
    } else {
      // fetch table
      this.analyticsTable = yield this.apollo.query(
        {
          query: getAnalyticsTableQuery,
          fetchPolicy: "network-only",
          variables: { slug: this.args.slug },
        },
        "saveAnalyticsTable.analyticsTable"
      );
    }
  }

  @action
  submitField(e) {
    e.preventDefault();

    this.saveAnalyticsField.perform(this.field);
    this.fetchData.perform();
  }

  @action
  updateAnalyticsField({ id, alias, dataSource }) {
    this.saveAnalyticsField.perform({
      id,
      alias,
      dataSource,
    });
  }

  @enqueueTask
  *saveAnalyticsField({ id, alias, dataSource }) {
    // TODO: Add the "show" attribute when available
    yield this.apollo.mutate({
      mutation: saveAnalyticsFieldMutation,
      fetchPolicy: "network-only",
      variables: {
        input: {
          table: this.tableId,
          id,
          alias,
          dataSource,
        },
      },
    });
  }

  @enqueueTask
  *removeAnalyticsField({ id }) {
    yield this.apollo.mutate({
      mutation: removeAnalyticsFieldMutation,
      fetchPolicy: "network-only",
      variables: {
        input: {
          id,
        },
      },
    });
    this.fetchData.perform();
  }
}
