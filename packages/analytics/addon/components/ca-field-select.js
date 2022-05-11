import { assert } from "@ember/debug";
import { action, set } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { restartableTask } from "ember-concurrency-decorators";

import getAvailableFieldsForFieldQuery from "@projectcaluma/ember-analytics/gql/queries/get-available-fields-for-field.graphql";

export default class CaFieldSelectComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked _selectedOption;
  @tracked options;

  constructor(...args) {
    super(...args);
    this.fetchOptions.perform();
  }

  get selectedOption() {
    if (!this.currentPathSegment) {
      return {};
    }
    return { ...this._selectedOption, ...{ value: this.currentPathSegment } };
  }

  get currentPathSegment() {
    if (!this.args.selectedPath) return "";
    const remainingFromParentPath = this.args.parentPath
      ? this.args.selectedPath.substring(this.args.parentPath.length + 1)
      : this.args.selectedPath;
    return this.firstSegment(remainingFromParentPath);
  }

  get hasRemainingPath() {
    if (!this.args.selectedPath) return false;
    const remainingFromParentPath = this.args.parentPath
      ? this.args.selectedPath.substring(this.args.parentPath.length + 1)
      : this.args.selectedPath;
    return remainingFromParentPath.length > this.currentPathSegment.length + 1;
  }

  get fieldPath() {
    if (!this.currentPathSegment) return "";
    return (
      (this.args.parentPath ? `${this.args.parentPath}.` : "") +
      this.currentPathSegment
    );
  }

  get isBranch() {
    if (
      (this.isRoot && this.fetchedFor === "_root_") ||
      this.fetchedFor === this.args.parentPath
    ) {
      return this._selectedOption ? !this._selectedOption.isLeaf : false;
    }
    return this.hasRemainingPath;
  }

  get isRoot() {
    return !this.args.parentPath;
  }

  @action
  update(value) {
    assert(
      "A listener for updates on CaFieldSelectComponent has to be set.",
      this.args.onSelect
    );
    set(this, "_selectedOption", value);
    this.args.onSelect(this._selectedOption);
  }

  @restartableTask
  *fetchOptions() {
    try {
      if (
        !this.fetchedFor ||
        (!this.isRoot && this.fetchedFor !== this.args.parentPath)
      ) {
        const options = yield this.apollo.query(
          {
            query: getAvailableFieldsForFieldQuery,
            fetchPolicy: "no-cache",
            variables: {
              slug: this.args.slug,
              prefix: this.args.parentPath ?? "",
              // depth: 1
            },
          },
          "analyticsTable.availableFields"
        );
        this.fetchedFor = this.isRoot ? "_root_" : this.args.parentPath;
        this.options = options.edges.map((edge) => edge.node);
      }
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t("caluma.analytics.notification.fetch-error")
      );
    }
  }

  firstSegment(path) {
    if (!path) return "";
    if (path.indexOf(".") === -1) {
      return path;
    }
    const delimiterIndex = path.indexOf(".");
    return path.substring(0, delimiterIndex);
  }
}
