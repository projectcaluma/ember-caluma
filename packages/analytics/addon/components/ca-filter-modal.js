import { enqueueTask } from "ember-concurrency";
import { queryManager } from "ember-apollo-client";
import Component from "@glimmer/component";
import { useResource } from "ember-resources";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";
import saveAnalyticsField from "@projectcaluma/ember-analytics/tasks/save-analytics-field";

export default class CaFilterModalComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked visible = false;
  @tracked newFilter;
  @tracked filters;

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
    this.newFilter = value.trim();
  }

  @action
  removeFilter(filter) {
    this.filters = this.filters.filter((value) => value !== filter);
  }

  @action
  addFilter() {
    if (this.filters.includes(this.newFilter)) {
      this.notification.warning(this.intl.t("filter already exists"));
    } else {
      this.filters = [this.newFilter, ...this.filters];
    }
    this.newFilter = null;
  }

  @enqueueTask saveField = saveAnalyticsField;
}
