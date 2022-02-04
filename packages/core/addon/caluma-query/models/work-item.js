import { inject as service } from "@ember/service";

import CalumaQueryModel, {
  dateAttr,
} from "@projectcaluma/ember-core/caluma-query/models/index";

export default class WorkItemModel extends CalumaQueryModel {
  @service intl;

  @dateAttr createdAt;
  @dateAttr modifiedAt;
  @dateAttr closedAt;
  @dateAttr deadline;

  get status() {
    return this.intl.t(
      `caluma.caluma-query.work-item.status.${this.raw.status}`
    );
  }

  static fragment = `{
    createdAt
    createdByUser
    createdByGroup
    closedAt
    closedByUser
    closedByGroup
    status
    meta
    addressedGroups
    controllingGroups
    assignedUsers
    name
    deadline
  }`;
}
