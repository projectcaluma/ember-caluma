import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CdInquiryNewFormComponent extends Component {
  @tracked edit = false;
  @tracked selectedGroups = [];

  @action
  clearSelectedGroups(e) {
    e.preventDefault();

    this.selectedGroups = [];
  }
}
