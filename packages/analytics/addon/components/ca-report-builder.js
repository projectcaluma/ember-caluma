import { action, computed, set } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import {
  dropTask,
  enqueueTask,
  restartableTask,
} from "ember-concurrency-decorators";

import removeAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-field.graphql";
import removeAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-table.graphql";
import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";
import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";
import getAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-table.graphql";
import FieldValidations from "@projectcaluma/ember-analytics/validations/field";
import slugify from "@projectcaluma/ember-core/utils/slugify";

class CaField {
  alias;
  filter;
  dataSource;
  show = true;
}

export default class CaReportBuilderComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;
  @service router;

  @tracked _tableSlug;
  @tracked analyticsTable;
  @tracked startingObject;

  constructor(...args) {
    super(...args);

    this._tableSlug = this.args.slug ?? "";
    this.startingObject = this.args["starting-objects"]
      ? this.args["starting-objects"][0].value
      : undefined;
    this.field = Changeset(
      new CaField(),
      lookupValidator(FieldValidations),
      FieldValidations
    );
  }

  get tableId() {
    return this.analyticsTable?.id;
  }

  get analyticsFields() {
    return this.analyticsTable?.fields.edges.map((edge) => edge.node);
  }

  @computed("analyticsTable.slug", "_tableSlug")
  get tableSlug() {
    return this.analyticsTable?.slug || this._tableSlug;
  }

  @action
  setTableSlug(value) {
    const slug = slugify(value);
    this._tableSlug = slug;
    if (this.analyticsTable) {
      set(this.analyticsTable, "slug", slug);
    }
  }

  @action
  setStartingObject(obj) {
    this.startingObject = obj;
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
      try {
        this.analyticsTable = yield this.apollo.query(
          {
            query: getAnalyticsTableQuery,
            // TODO: availableFields have the same ID, therefore we turned apollo caching off
            fetchPolicy: "no-cache",
            variables: { slug: this.args.slug },
          },
          "analyticsTable"
        );
      } catch (e) {
        this.notification.danger(
          this.intl.t(`caluma.analytics.notification.table_not_found`)
        );
        this.router.transitionTo(this.args["analytics-route"]);
      }
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
  async submitTable() {
    // TODO: updating the slug means, we must update the URL query as well.
    // which is not consitent if it is triggered by this component, huh?
    // await this.updateTable.perform();
  }

  @action
  async submitField() {
    this.field.validate();

    if (this.field.isInvalid) {
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.field_invalid`)
      );
      return;
    }
    if (
      this.analyticsFields.find(
        (existing) => existing.dataSource === this.field.get("dataSource")
      )
    ) {
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.field_exists`)
      );
      return;
    }

    await this.saveAnalyticsField.perform(this.field.pendingData);
    this.resetFieldInputs();
  }

  @action
  updateAnalyticsField(field) {
    this.saveAnalyticsField.perform(field);
  }

  @enqueueTask
  *saveAnalyticsField({
    id,
    alias,
    dataSource /* , alias_translation , show, filter */,
  }) {
    // TODO: Add the "alias_translation" attribute when available
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

  @restartableTask
  *createTable() {
    if (this.tableSlug.trim() === "new") {
      this.notification.danger(
        this.intl.t("caluma.analytics.notification.table_title_invalid")
      );
      return;
    }
    yield this.args["on-add"](this.tableSlug, this.startingObject);
  }

  @dropTask
  *deleteTable() {
    yield this.apollo.mutate({
      mutation: removeAnalyticsTableMutation,
      fetchPolicy: "network-only",
      variables: {
        input: {
          slug: this.analyticsTable.slug,
        },
      },
    });
    this.router.transitionTo(this.args["analytics-route"]);
  }

  resetFieldInputs() {
    this.field.rollback();
  }
}
