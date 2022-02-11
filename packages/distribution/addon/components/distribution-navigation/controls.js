import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class DistributionNavigationControlsComponent extends Component {
  @action
  noop(e) {
    e.preventDefault();
  }
}
