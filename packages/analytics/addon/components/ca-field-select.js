import { assert } from "@ember/debug";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";

import getAvailableFieldsForFieldQuery from "@projectcaluma/ember-analytics/gql/queries/get-available-fields-for-field.graphql";

export default class CaFieldSelectComponent extends Component {
  @queryManager apollo;

  @tracked _selectedOption;
  @tracked options;

  constructor(...args) {
    super(...args);

    if (this.currentPathSegment) {
      const option = {
        label: this.capitalize(this.currentPathSegment),
        value: this.currentPathSegment,
      };
      this.options = [option];
      this._selectedOption = option;
    }
  }

  get selectedOption() {
    return this._selectedOption;
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
    if (this.fetchedFor) {
      return this._selectedOption ? !this._selectedOption.isLeaf : false;
    }
    return this.hasRemainingPath;
  }

  @action
  update(value) {
    assert(
      "A listener for updates on CaFieldSelectComponent has to be set.",
      this.args.onSelect
    );

    this._selectedOption = value;
    this.args.onSelect(this._selectedOption.sourcePath);
  }

  @action
  async fetchOptions() {
    if (!this.fetchedFor || this.fetchedFor !== this.currentPathSegment) {
      const options = await this.apollo.query(
        {
          query: getAvailableFieldsForFieldQuery,
          fetchPolicy: "no-cache",
          variables: {
            slug: this.args.slug,
            prefix: this.args.parentPath ?? "",
          },
        },
        "analyticsTable.availableFields"
      );
      this.fetchedFor = this.currentPathSegment;
      this.options = options.edges.map((edge) => edge.node);
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  firstSegment(path) {
    if (!path) return "";
    if (path.indexOf(".") === -1) {
      return path;
    }
    const delimiterIndex = path.indexOf(".");
    return path.substring(0, delimiterIndex);
  }

  lastSegment(path) {
    if (!path) return "";
    if (path.indexOf(".") === -1) {
      return path;
    }
    const delimiterIndex = path.lastIndexOf(".");
    return path.substring(delimiterIndex);
  }
}
