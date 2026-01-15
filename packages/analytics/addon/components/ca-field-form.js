import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { task } from "ember-concurrency";

import CaToggleSwitchComponent from "@projectcaluma/ember-analytics/components/ca-toggle-switch";
import saveAnalyticsField from "@projectcaluma/ember-analytics/tasks/save-analytics-field";
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

  saveField = task({ enqueue: true }, async (input) =>
    saveAnalyticsField(input),
  );

  toggleComponent = CaToggleSwitchComponent;

  constructor(...args) {
    super(...args);
    this.field = Changeset(
      new Field(),
      lookupValidator(FieldValidations),
      FieldValidations,
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
        this.intl.t(`caluma.analytics.notification.field-invalid`),
      );
    } else if (
      this.analyticsFields.find(
        (existing) => existing.alias === this.field.get("alias"),
      )
    ) {
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.alias-exists`),
      );
    } else {
      const { id, alias, dataSource, aggregateFunction, showOutput } =
        this.field.pendingData;
      await this.saveField.perform({
        table: this.tableId,
        id,
        alias,
        dataSource,
        showOutput,
        function: aggregateFunction,
      });
      this.toggleForm();
    }
  }
}
