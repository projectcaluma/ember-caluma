import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class DistributionNavigationSectionComponent extends Component {
  @tracked expanded = true;

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

    return this.args.inquiries.sort((a, b) =>
      a[sortProperty].localeCompare(b[sortProperty])
    );
  }
}
