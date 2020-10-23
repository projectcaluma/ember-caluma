import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class componentsCfbFormItemListItem extends Component {
  @service intl;

  get labelClass() {
    if (this.args.item.isArchived) {
      return "uk-label-warning";
    } else if (this.args.item.isPublished) {
      return "uk-label-success";
    }

    return "";
  }

  get labelName() {
    if (this.args.item.isArchived) {
      return this.intl.t("caluma.form-builder.form.isArchived");
    } else if (this.args.item.isPublished) {
      return this.intl.t("caluma.form-builder.form.isPublished");
    }

    return this.intl.t("caluma.form-builder.form.draft");
  }
}
