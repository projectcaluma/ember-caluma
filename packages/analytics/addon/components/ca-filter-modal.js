import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { enqueueTask } from "ember-concurrency";
import UkButtonComponent from "ember-uikit/components/uk-button";

import saveAnalyticsField from "@projectcaluma/ember-analytics/tasks/save-analytics-field";

export default class CaFilterModalComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked visible = false;
  @tracked newFilter;
  @tracked filters;

  @enqueueTask saveField = saveAnalyticsField;

  buttonComponent = UkButtonComponent;

  constructor(...args) {
    super(...args);
    this.filters = this.args.field?.filters ?? [];
  }

  get graphqlInput() {
    return {
      id: this.args.field.id,
      alias: this.args.field.alias,
      dataSource: this.args.field.dataSource,
      function: this.args.field.function,
      table: this.args.table,
      filters: this.filters,
    };
  }

  @action
  updateNewFilter({ target: { value } }) {
    this.newFilter = value;
  }

  @action
  removeFilter(filter) {
    this.filters = this.filters.filter((value) => value !== filter);
  }

  @action
  addFilter() {
    const filter = this.newFilter.trim();
    if (this.filters.includes(filter)) {
      this.notification.warning(
        this.intl.t("caluma.analytics.notification.filter-exists"),
      );
    } else {
      this.filters = [filter, ...this.filters];
    }
    this.newFilter = null;
  }
}
