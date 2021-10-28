import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { dropTask, enqueueTask } from "ember-concurrency-decorators";

import removeAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-field.graphql";
import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";
import getAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-table.graphql";

class CaField {
  @tracked alias;
  @tracked filter;
  @tracked dataSource;
  @tracked show = true;
}

// TODO: make this dynamic
const STATICStartingObject = { label: "Cases", value: "CASES" };
const STATICAvailableStartingObjects = [
  { label: "Test", value: "TEST" },
  { label: "Cases", value: "CASES" },
];

export default class CaReportBuilderComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked analyticsTable;
  @tracked tableSlug;
  @tracked field;
  @tracked startingObject = STATICStartingObject;

  constructor(...args) {
    super(...args);

    this.tableSlug = this.args.slug ?? "";
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
    return STATICAvailableStartingObjects;
  }

  @action
  setStartingObject(value) {
    this.startingObject = value;
  }

  @action
  setTableSlug(value) {
    this.tableSlug = value;
  }

  @action
  setFieldDescription(description) {
    for (const [key, value] of Object.entries(description)) {
      if (Object.keys(this.field).includes(key)) {
        this.field[key] = value;
      }
    }
  }

  @action
  setFieldPath(path) {
    this.field.dataSource = path;
    this.field.alias = path ? path.substring(path.lastIndexOf(".") + 1) : "";
  }

  @dropTask
  *fetchData() {
    if (this.args.slug) {
      this.analyticsTable = yield this.apollo.query(
        {
          query: getAnalyticsTableQuery,
          // availableFields have the same ID, therefore we turned apollo caching off
          fetchPolicy: "no-cache",
          variables: { slug: this.args.slug },
        },
        "analyticsTable"
      );
    }
  }

  @action
  async submitField(e) {
    e.preventDefault();

    if (
      this.analyticsFields.find(
        (existing) => existing.dataSource === this.field.dataSource
      )
    ) {
      return this.notification.danger(
        this.intl.t(`caluma.analytics.notification.field_exists`)
      );
    }

    await this.saveAnalyticsField.perform(this.field);
    await this.fetchData.perform();
    this.resetFieldInputs();
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
    // TODO: Add the "filter" attribute when available
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

  resetFieldInputs() {
    this.field = new CaField();
  }
}
