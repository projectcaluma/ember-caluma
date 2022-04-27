import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CdTruncatedComponent extends Component {
  @tracked expand = false;

  get length() {
    return parseInt(this.args.length);
  }

  get displayedText() {
    if (this.truncate && !this.expand) {
      // strip input string to the passed length minus 3 to make sure the output
      // including the 3 dots doesn't exceed the expected length
      return `${this.args.text.substring(0, this.length - 3).trim()}...`;
    }

    return this.args.text;
  }

  get truncate() {
    return this.args.text.length > this.length;
  }

  @action
  toggleExpand(e) {
    e.preventDefault();

    this.expand = !this.expand;
  }
}
