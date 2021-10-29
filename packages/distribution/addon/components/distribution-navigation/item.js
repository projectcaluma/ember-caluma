import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class DistributionNavigationItemComponent extends Component {
  @service router;

  get model() {
    return {
      from: this.args.inquiry.controllingGroups[0],
      to: this.args.inquiry.addressedGroups[0],
    };
  }

  get isActive() {
    return this.router.isActive("distribution.inquiry", this.model);
  }
}
