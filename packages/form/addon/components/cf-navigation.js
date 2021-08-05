import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class CfNavigationComponent extends Component {
  @action
  goToNextItem() {
    this.args.navigation.goToNextItem();
  }
}
