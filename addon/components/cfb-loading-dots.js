import Component from "@ember/component";
import layout from "../templates/components/cfb-loading-dots";

export default Component.extend({
  layout,
  tagName: "span",
  count: 3
});
