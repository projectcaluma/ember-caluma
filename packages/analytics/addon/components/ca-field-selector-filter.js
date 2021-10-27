import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CaFieldSelectorFilterComponent extends Component {
  @tracked filters = [];
  @tracked newFilterValue = "";

  @action
  removeFilter(filter) {
    this.filters = this.filters.filter((f) => f !== filter);
  }

  @action
  addFilter(event) {
    event.preventDefault();
    if (this.newFilterValue) {
      this.filters = this.filters.concat(this.newFilterValue);
      this.newFilterValue = "";
      this.args.onUpdate(this.filters);
    }
  }
}
