import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CdNavigationSectionComponent extends Component {
  @service router;

  @tracked expanded = true;

  get isActive() {
    return (
      this.inquiries.find((inquiry) =>
        this.router.isActive("inquiry", {
          to: inquiry.addressedGroups[0],
          from: inquiry.controllingGroups[0],
        })
      ) !== undefined
    );
  }

  @action
  toggle(e) {
    e.preventDefault();

    this.expanded = !this.expanded;
  }

  get inquiries() {
    const sortProperty =
      this.args.type === "addressed"
        ? "controllingGroupName"
        : "addressedGroupName";

    return (
      this.args.inquiries?.sort((a, b) =>
        a[sortProperty].localeCompare(b[sortProperty])
      ) ?? []
    );
  }
}
