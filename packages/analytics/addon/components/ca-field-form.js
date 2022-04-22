import { getOwner } from "@ember/application";
import { action, set } from "@ember/object";
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
import { useTask, useResource } from "ember-resources";

import removeAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-field.graphql";
import removeAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-table.graphql";
import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";
import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";
import getAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-table.graphql";
import FetchAnalyticsTableResource from "@projectcaluma/ember-analytics/resources/analytics-table";
import FieldValidations from "@projectcaluma/ember-analytics/validations/field";
import slugify from "@projectcaluma/ember-core/utils/slugify";

class Field {
  @tracked alias;
  @tracked dataSource;
  @tracked aggregateFunction = "VALUE";
  @tracked showOutput = true;
}

export default class CaFieldFormComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked showForm = false;

  constructor(...args) {
    super(...args);
    this.config = getOwner(this).resolveRegistration("config:environment");
    this.field = Changeset(
      new Field(),
      lookupValidator(FieldValidations),
      FieldValidations
    );
  }

  get tableId() {
    return this.args.analyticsTable?.id;
  }

  get analyticsFields() {
    return this.args.analyticsTable?.fields.edges.map((edge) => edge.node);
  }

  get tableSlug() {
    return this.args.analyticsTable?.slug;
  }

  @action
  toggleForm() {
    this.showForm = !this.showForm;
    this.field.rollback();
  }

  @action
  setFieldPath(path) {
    this.field.set("dataSource", path);
    this.field.set(
      "alias",
      path ? path.substring(path.lastIndexOf(".") + 1) : ""
    );
  }

  @action
  async submitField() {
    this.field.validate();

    if (this.field.isInvalid) {
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.field_invalid`)
      );
    } else if (
      this.analyticsFields.find(
        (existing) => existing.alias === this.field.get("alias")
      )
    ) {
      // TODO check if all translations are in the yaml file
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.alias_exists`)
      );
    } else {
      await this.saveAnalyticsField.perform(this.field.pendingData);
      this.toggleForm();
    }
  }

  @action
  updateAnalyticsField(field) {
    this.saveAnalyticsField.perform(field);
  }

  @enqueueTask
  *saveAnalyticsField({
    id,
    alias,
    dataSource,
    aggregateFunction,
    showOutput,
  }) {
    yield this.apollo.mutate({
      mutation: saveAnalyticsFieldMutation,
      variables: {
        input: {
          table: this.tableId,
          id,
          alias,
          dataSource,
          showOutput,
          function: aggregateFunction,
        },
      },
    });
  }
}
