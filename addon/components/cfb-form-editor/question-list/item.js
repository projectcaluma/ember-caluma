import Component from "@ember/component";
import layout from "../../../templates/components/cfb-form-editor/question-list/item";

export default Component.extend({
  layout,
  tagName: "li",
  classNames: ["uk-position-relative", "cfb-form-editor__question-list__item"]
});
