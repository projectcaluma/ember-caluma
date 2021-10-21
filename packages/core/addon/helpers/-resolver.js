import Helper from "@ember/component/helper";
import { assert } from "@ember/debug";
import { run } from "@ember/runloop";
import { inject as service } from "@ember/service";

export default class PrivateResolver extends Helper {
  @service("-scheduler") scheduler;
  @service calumaOptions;

  get resolverType() {
    return assert("`resolverType` needs to be defined");
  }

  _identifier = null;
  _value = null;
  _settled = false;

  compute([identifiers]) {
    const identifier = Array.isArray(identifiers)
      ? identifiers[0]
      : identifiers;

    // The parameter for the helper changed so we need to recompute and store
    // the new parameter to remember it at the next computation
    if (identifier !== this._identifier) {
      this._settled = false;
      this._identifier = identifier;
    }

    // The value is resolved, return the passed property (default is defined as
    // `{type}NameProperty` on the caluma options service) of the value. This
    // happens after the `this.recompute()` call in `resolve`
    if (this._settled) {
      return this._value?.[
        this.calumaOptions[`${this.resolverType}NameProperty`]
      ];
    }

    // Schedule a resolve batch to only trigger the resolve method in the caluma
    // options service once. We pass a resolve function to run after the
    // possibly asynchronous resolve method.
    this.scheduler.resolveOnce(identifier, this.resolverType, (value) =>
      run(this, "resolve", value)
    );

    // Return the default value (`null`) if the value is not computed yet
    return this._value;
  }

  /**
   * Resolver method to set the value to the resolved value and mark the helper
   * as settled and then recompute it to display that value.
   *
   * @method resolve
   * @param {*} value The resolved group value
   */
  resolve(value) {
    this._value = value;
    this._settled = true;
    this.recompute();
  }
}
