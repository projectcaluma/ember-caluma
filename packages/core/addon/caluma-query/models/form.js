import CalumaQueryModel from "@projectcaluma/ember-core/caluma-query/models/index";

export default class FormModel extends CalumaQueryModel {
  static fragment = `{
    name
    slug
    description
    isArchived
    isPublished
  }`;
}
