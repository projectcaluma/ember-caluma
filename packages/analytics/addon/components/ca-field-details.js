import { assert } from "@ember/debug";
import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class CaFieldDetailsComponent extends Component {
  @action
  toggleShowOutput({ target: box }) {
    assert(
      "Update handler has to be set on CaFieldDetailsComponent.",
      this.args.onUpdate
    );
    this.args.onUpdate({ show: box.checked });
  }

  @action
  updateAlias({ target: input }) {
    assert(
      "Update handler has to be set on CaFieldDetailsComponent.",
      this.args.onUpdate
    );
    this.args.onUpdate({ alias: input.value });
  }
}
