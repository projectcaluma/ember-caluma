import { assert } from "@ember/debug";
import { once } from "@ember/runloop";
import Service, { inject as service } from "@ember/service";
import { camelize } from "@ember/string";
import { dependencySatisfies } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { pluralize } from "ember-inflector";

const toArrayIsDeprecated = dependencySatisfies("ember-data", "^4.7.0");

export default class PrivateSchedulerService extends Service {
  @service calumaOptions;

  @tracked groupCache = [];
  @tracked userCache = [];

  resolveGroup = task(
    { enqueue: true },
    async () => await this.#resolveType("group"),
  );
  resolveUser = task(
    { enqueue: true },
    async () => await this.#resolveType("user"),
  );

  async #resolveType(type) {
    const identifiers = [...(this[type]?.identifiers ?? [])];
    const callbacks = [...(this[type]?.callbacks ?? [])];

    this[type] = undefined;

    if (!identifiers.length) return;

    const cached = this[`${type}Cache`];
    const uncachedIdentifiers = identifiers.filter(
      (identifier) =>
        !cached
          .map((resolved) =>
            String(resolved[this.calumaOptions[`${type}IdentifierProperty`]]),
          )
          .includes(String(identifier)),
    );

    const methodName = camelize(`resolve-${pluralize(type)}`);
    const result = uncachedIdentifiers.length
      ? await this.calumaOptions[methodName]?.(uncachedIdentifiers)
      : [];

    const allResults = toArrayIsDeprecated
      ? [...cached, ...(result ?? [])]
      : [...cached, ...(result?.toArray?.() ?? result ?? [])];

    if (result?.length) {
      this[`${type}Cache`] = allResults;
    }

    await Promise.all(callbacks.map((callback) => callback(allResults)));

    return allResults;
  }

  /**
   * Resolve a certain object of a type only once in the runloop.
   *
   * This method adds the given identifier to a set of already requested
   * identifiers of a type and calls the resolve method of that type once in a
   * single render loop and then passes the resolved object to a passed
   * callback.
   *
   * @method resolveOnce
   * @param {String} identifier The identifier used to find the resolved object
   * @param {"group"|"user"} type The type of the object to resolve
   * @param {Function} callback The callback function to call after the object is resolved
   */
  resolveOnce(identifier, type, callback) {
    const _callback = (result) => {
      callback(
        result.find(
          (obj) =>
            String(obj[this.calumaOptions[`${type}IdentifierProperty`]]) ===
            String(identifier),
        ),
      );
    };

    if (!this[type]) {
      this[type] = { identifiers: new Set(), callbacks: new Set() };
    }

    this[type].identifiers.add(identifier);
    this[type].callbacks.add(_callback);

    const typeResolverName = camelize(`resolve-${type}`);

    assert(
      `${typeResolverName} needs to be defined on the scheduler service`,
      typeResolverName in this,
    );

    once(this[typeResolverName], "perform");
  }

  resolve(identifiers, type) {
    const typeResolverName = camelize(`resolve-${type}`);

    if (!this[type]) {
      this[type] = { identifiers: new Set(), callbacks: new Set() };
    }

    identifiers.forEach((identifier) => this[type].identifiers.add(identifier));

    return this[typeResolverName]?.perform();
  }
}
