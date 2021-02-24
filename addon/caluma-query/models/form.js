import CalumaQueryModel from "./index";

export default class FormModel extends CalumaQueryModel {
  static fragment = `{
    name
    slug
    description
    isArchived
    isPublished
  }`;
}
