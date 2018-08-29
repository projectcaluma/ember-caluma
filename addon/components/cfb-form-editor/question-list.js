import Component from "@ember/component";
import layout from "../../templates/components/cfb-form-editor/question-list";
import UIkit from "uikit";
import { run } from "@ember/runloop";
import { optional } from "ember-composable-helpers/helpers/optional";

export default Component.extend({
  layout,
  tagName: "ul",
  classNames: ["uk-list"],
  attributeBindings: ["sortable:uk-sortable"],
  sortable: "handle: .uk-sortable-handle;",

  init() {
    this._super(...arguments);

    this.set("_children", {});
  },

  didInsertElement() {
    this._super(...arguments);

    UIkit.util.on(this.get("element"), "moved", (...args) =>
      run(this, this._handleMoved, ...args)
    );
  },

  _handleMoved({ detail: [sortable] }) {
    let children = [...sortable.$el.children];

    optional([this.get("on-reorder-questions")])(
      children.map(child => this.get(`_children.${child.id}`))
    );
  },

  actions: {
    registerChild(elementId, slug) {
      this.set(`_children.${elementId}`, slug);
    },

    unregisterChild(elementId) {
      this.set(`_children.${elementId}`, undefined);
    }
  }
});
