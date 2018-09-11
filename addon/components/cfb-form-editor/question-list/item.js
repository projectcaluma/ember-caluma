import Component from "@ember/component";
import layout from "../../../templates/components/cfb-form-editor/question-list/item";
import { optional } from "ember-composable-helpers/helpers/optional";
import { reads } from "@ember/object/computed";

export default Component.extend({
  layout,
  tagName: "li",

  slug: reads("question.slug"),

  didInsertElement() {
    this._super(...arguments);

    optional([this.get("on-register")])(
      this.get("elementId"),
      this.get("slug")
    );
  },

  willDestroyElement() {
    this._super(...arguments);

    optional([this.get("on-unregister")])(
      this.get("elementId"),
      this.get("slug")
    );
  }
});
