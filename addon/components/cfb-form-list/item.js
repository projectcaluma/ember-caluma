import Component from "@ember/component";
import layout from "../../templates/components/cfb-form-list/item";
import { inject as service } from "@ember/service";

export default class componentsCfbFormItemListItem extends Component {
  @service intl;

  layout = layout;

  tagName = "li";

  classNames = ["uk-text-nowrap", "uk-flex", "uk-flex-middle"];

  get labelClass() {
    if (this.item.isArchived) {
      return "uk-label-warning";
    } else if (this.item.isPublished) {
      return "uk-label-success";
    }

    return "";
  }

  get labelName() {
    if (this.item.isArchived) {
      return this.intl.t("caluma.form-builder.form.isArchived");
    } else if (this.item.isPublished) {
      return this.intl.t("caluma.form-builder.form.isPublished");
    }

    return this.intl.t("caluma.form-builder.form.draft");
  }
}
