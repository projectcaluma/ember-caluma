import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { enqueueTask } from "ember-concurrency-decorators";

import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";
import FieldValidations from "@projectcaluma/ember-analytics/validations/field";

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

  @tracked supportedFunctions = [];
  @tracked isValueField = false;
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

  get showAggregationSelect() {
    return this.field.dataSource && this.supportedFunctions.length;
  }

  @action
  toggleForm() {
    this.showForm = !this.showForm;
    this.field.rollback();
  }

  @action
  setFieldPath(field) {
    this.field.dataSource = field.sourcePath;
    this.field.alias = field.label;
    this.supportedFunctions = field.supportedFunctions;
    this.isValueField = field.isValue;
  }

  @action
  async submitField() {
    this.field.validate();

    if (this.field.isInvalid) {
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.field-invalid`)
      );
    } else if (
      this.analyticsFields.find(
        (existing) => existing.alias === this.field.get("alias")
      )
    ) {
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.alias-exists`)
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
