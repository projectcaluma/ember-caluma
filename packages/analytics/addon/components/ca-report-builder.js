import { action, computed, set } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { Changeset } from "ember-changeset";
import { dropTask, enqueueTask } from "ember-concurrency-decorators";

import removeAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-field.graphql";
import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";
import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";
import getAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-table.graphql";
import Validations from "@projectcaluma/ember-analytics/validations/field";
import slugify from "@projectcaluma/ember-core/utils/slugify";

class CaField {
  alias;
  filter;
  dataSource;
  show = true;
}

// TODO: make this dynamic
const STATICStartingObject = { label: "Cases", value: "CASES" };
const STATICAvailableStartingObjects = [{ label: "Cases", value: "CASES" }];

export default class CaReportBuilderComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked analyticsTable;
  @tracked _tableSlug;
  // @tracked field;
  @tracked startingObject = STATICStartingObject;

  constructor(...args) {
    super(...args);

    this._tableSlug = this.args.slug ?? "";
    // TODO: Check if this changeset thingy is working fine
    this.field = Changeset(new CaField(), Validations);
    this.field.snapshot();
  }

  get tableId() {
    return this.analyticsTable.id;
  }

  get analyticsFields() {
    return this.analyticsTable.fields.edges.map((edge) => edge.node);
  }

  get availableStartingObjects() {
    return STATICAvailableStartingObjects;
  }

  @computed("analyticsTable.slug")
  get tableSlug() {
    return this.analyticsTable.slug;
  }

  @action
  setTableSlug({ target: input }) {
    set(this.analyticsTable, "slug", slugify(input.value));
  }

  @action
  setStartingObject(obj) {
    this.startingObject = obj;
  }

  @action
  setFieldDescription(description) {
    for (const [key, value] of Object.entries(description)) {
      if (Object.keys(this.field.data).includes(key)) {
        this.field.set(key, value);
      }
    }
  }

  @action
  setFieldPath(path) {
    this.field.set("dataSource", path);
    this.field.set(
      "alias",
      path ? path.substring(path.lastIndexOf(".") + 1) : ""
    );
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

  @dropTask
  *updateTable() {
    this.analyticsTable = yield this.apollo.mutate(
      {
        mutation: saveAnalyticsTableMutation,
        fetchPolicy: "network-only",
        variables: {
          input: {
            name: this.tableSlug,
            slug: this.tableSlug,
            startingObject: this.startingObject.value,
          },
        },
      },
      "analyticsTable"
    );
  }

  @action
  async submitTable(e) {
    e.preventDefault();
    // TODO: updating the slug means, we must update the URL query as well.
    // which is not consitent if it is triggered by this component, huh?

    // await this.updateTable.perform();
  }

  @action
  async submitField(e) {
    e.preventDefault();
    if (this.field.isInvalid) {
      return this.notification.danger(
        this.intl.t(`caluma.analytics.notification.field_invalid`)
      );
    }
    if (
      this.analyticsFields.find(
        (existing) => existing.dataSource === this.field.get("dataSource")
      )
    ) {
      return this.notification.danger(
        this.intl.t(`caluma.analytics.notification.field_exists`)
      );
    }
    await this.field.save();

    await this.saveAnalyticsField.perform(this.field.data);
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
    this.fetchData.perform();
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
    this.field.restore();
  }
}
