import Component from "@ember/component";
import { ComponentQueryManager } from "ember-apollo-client";
import layout from "../templates/components/cf-form";
import { assert } from "@ember/debug";

/**
 * Component to display a form for a whole document.
 *
 * ```hbs
 * {{cf-form document=document}}
 * ```
 *
 * @class CfFormComponent
 */
export default Component.extend(ComponentQueryManager, {
  layout,
  tagName: "form",
  attributeBindings: ["novalidate"],
  novalidate: "novalidate",

  didReceiveAttrs() {
    this._super(...arguments);

    assert("A document `document` must be passed", this.document);
  },

  /**
   * The document to display
   *
   * @argument {Document} document
   */
  document: null,

  /**
   * Allows the whole form to be disabled.
   *
   * @argument {Boolean} disabled
   */
  disabled: false,

  /**
   * A hash containg mappings for widget overrides.
   * Set the key of the hash to the slug of the question
   * and the value to the Ember component.
   *
   * ```hbs
   * {{cf-form
   *   document=document
   *   overrides=(hash foo=(component "bar"))
   * }}
   * ```
   *
   * @argument {Object} overrides
   */
  overrides: null,

  /**
   * Can be used to pass "context" information from the outside through
   * to custom overrides.
   *
   * @argument {*} overrides
   */
  context: null
});
