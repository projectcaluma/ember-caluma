import Component from "@ember/component";
import layout from "../templates/components/cfb-loading-dots";

export default Component.extend({
  layout,
  tagName: "span",
  classNames: ["cfb-loading-dots"],
  count: 3
});
