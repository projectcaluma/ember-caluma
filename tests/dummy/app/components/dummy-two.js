import Component from "@ember/component";
import hbs from "htmlbars-inline-precompile";

export default Component.extend({
  layout: hbs`<div data-test-dummy-two>Dummy Two</div>`,
  tagName: ""
});
