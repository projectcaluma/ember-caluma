import { inject as service } from "@ember/service";

import CalumaQueryModel, {
  momentAttr,
} from "@projectcaluma/ember-core/caluma-query/models/index";

export default class CaseModel extends CalumaQueryModel {
  @service intl;

  @momentAttr createdAt;
  @momentAttr modifiedAt;
  @momentAttr closedAt;

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
