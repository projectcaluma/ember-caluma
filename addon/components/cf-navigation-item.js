import Component from "@ember/component";
import layout from "../templates/components/cf-navigation-item";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "",
  layout,

  section: null,
  subSection: null,

  _subSection: computed(
    "subSection",
    "field.childDocument.fields.[]",
    function() {
      if (
        !this.get("subSection") &&
        !(this.get("field.childDocument.fields") || []).some(
          f => f.get("question.__typename") !== "FormQuestion"
        )
      ) {
        return this.get("field.childDocument.fields.firstObject.question.slug");
      }
      return this.get("subSection");
    }
  )
});
