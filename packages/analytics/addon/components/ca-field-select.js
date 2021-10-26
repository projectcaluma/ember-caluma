import { assert } from "@ember/debug";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CaFieldSelectComponent extends Component {
  @tracked selectedOption;

  constructor(...args) {
    super(...args);

    this.findOptionForPath(this.args.path);
  }

  findOptionForPath(path) {
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

  get selectedPath() {
    // TODO: if sourcePath always represents the "full" path the following is obsolete
    // if(!this.args.path){
    //   return this.selectedOption.sourcePath;
    // }
    // return [this.args.path,this.selectedOption.sourcePath].join(".");
    return this.selectedOption.sourcePath;
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
    this.args.onSelect(this.selectedPath);
  }
}
