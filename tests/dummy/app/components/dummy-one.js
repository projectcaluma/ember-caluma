import Component from "@ember/component";
import { hbs } from "ember-cli-htmlbars";

export default Component.extend({
  layout: hbs`<div data-test-dummy-one>Dummy One</div>`,
  tagName: ""
});
