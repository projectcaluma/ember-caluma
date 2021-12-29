import { cached } from "tracked-toolbox";

import Base from "@projectcaluma/ember-form/lib/base";

/**
 * Object that represents a blueprint form
 */
export default class Form extends Base {
  constructor({ raw, owner }: { raw: RawForm; owner: unknown }) {
    super({ owner });

    this.raw = raw;

    this.pushIntoStore();
  }

  /**
   * The raw data of the form
   */
  readonly raw: RawForm;

  /**
   * The primary key of the form.
   */
  @cached
  get pk(): string {
    return `Form:${this.slug}`;
  }

  /**
   * The slug of the form
   */
  @cached
  get slug(): string {
    return this.raw.slug;
  }
}
