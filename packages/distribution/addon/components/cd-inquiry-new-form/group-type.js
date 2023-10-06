import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CdInquiryNewFormGroupTypeComponent extends Component {
  @tracked _isExpanded = true;

  get isExpanded() {
    // if we are searching all the groups need to be expanded anyway
    return this.args.search !== "" ? true : this._isExpanded;
  }

  set isExpanded(value) {
    this._isExpanded = value;
  }
}
