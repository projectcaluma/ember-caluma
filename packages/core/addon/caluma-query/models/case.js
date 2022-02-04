import { inject as service } from "@ember/service";

import CalumaQueryModel, {
  dateAttr,
} from "@projectcaluma/ember-core/caluma-query/models/index";

export default class CaseModel extends CalumaQueryModel {
  @service intl;

  @dateAttr createdAt;
  @dateAttr modifiedAt;
  @dateAttr closedAt;

  get status() {
    return this.intl.t(`caluma.caluma-query.case.status.${this.raw.status}`);
  }

  static fragment = `{
    createdAt
    modifiedAt
    createdByUser
    createdByGroup
    closedAt
    closedByUser
    closedByGroup
    status
    meta
  }`;
}
