import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CdNavigationSectionComponent extends Component {
  @service distribution;
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

  get inquiries() {
    return this.distribution.inquiries?.[this.args.type] ?? [];
  }

  @action
  toggle(e) {
    e.preventDefault();

    this.expanded = !this.expanded;
  }
}
