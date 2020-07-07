import CalumaQueryModel, { momentAttr } from "./index";
import { inject as service } from "@ember/service";

export default class WorkItemModel extends CalumaQueryModel {
  @service intl;

  @momentAttr createdAt;
  @momentAttr modifiedAt;
  @momentAttr closedAt;
  @momentAttr deadline;

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
