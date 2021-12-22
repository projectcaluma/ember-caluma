import { assert } from "@ember/debug";
import { cached } from "tracked-toolbox";

import Base from "@projectcaluma/ember-form/lib/base";

/**
 * Object that represents a blueprint form
 *
 * @class Form
 */
export default class Form extends Base {
  constructor({ raw, ...args }) {
    assert("A graphql form `raw` must be passed", raw?.__typename === "Form");

    super({ raw, ...args });

    this.pushIntoStore();
  }

  /**
   * The primary key of the form.
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    return `Form:${this.slug}`;
  }

  /**
   * The slug of the form
   *
   * @property {String} slug
   */
  @cached
  get slug() {
    return this.raw.slug;
  }
}
