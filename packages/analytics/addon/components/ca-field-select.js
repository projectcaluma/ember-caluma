import { assert } from "@ember/debug";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CaFieldSelectComponent extends Component {
  @tracked selectedOption;
  @tracked childPathSegment;

  constructor(...args) {
    super(...args);

    this.selectOptionForPath(this.firstPathSegment(this.args.path));
  }

  firstPathSegment(path) {
    if (!path) return;
    if (path.indexOf(".") === -1) {
      this.childPathSegment = "";
      return path;
    }
    const delimiterIndex = path.indexOf(".");
    this.childPathSegment = path.substring(delimiterIndex + 1);
    return path.substring(0, delimiterIndex);
  }

  selectOptionForPath(path) {
    if (path && this.args.options && Array.isArray(this.args.options)) {
      this.selectedOption = this.args.options.find((field) => {
        return field.sourcePath === path;
      });
    }
  }

  get availableFields() {
    /* TODO: this technique could be replace by fetching nested fields in the
    selector component itself */
    return this.args.options.filter((field) => {
      return field.sourcePath.startsWith(`${this.args.path}.`);
    });
  }

  get isBranch() {
    return this.selectedOption ? !this.selectedOption.isLeaf : false;
  }

  @action
  update(value) {
    assert(
      "A listener for updates on CaFieldSelectComponent has to be set.",
      this.args.onSelect
    );
    this.selectedOption = value;
    this.args.onSelect(this.selectedOption.sourcePath);
  }
}
