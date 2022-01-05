import { InMemoryCache } from "@apollo/client/cache";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import possibleTypes from "@projectcaluma/ember-core/-private/possible-types";
import CalumaApolloService from "@projectcaluma/ember-core/services/apollo";

module("Unit | Service | apollo", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    // this is needed since the tests don't read the addons `after` config which
    // causes the owner to register the standard service of
    // `ember-apollo-client` as `service:apollo`
    this.owner.register("service:apollo", CalumaApolloService);
  });

  test("it uses the correct possible types", function (assert) {
    assert.expect(2);

    const cache = this.owner.lookup("service:apollo").cache();

    assert.ok(cache instanceof InMemoryCache);
    assert.deepEqual(cache.config.possibleTypes, possibleTypes);
  });

  test("it resolves the correct data id", function (assert) {
    assert.expect(2);

    const cache = this.owner.lookup("service:apollo").cache();

    assert.strictEqual(
      cache.config.dataIdFromObject({
        slug: "test",
        __typename: "TestType",
      }),
      "TestType:test"
    );

    assert.strictEqual(
      cache.config.dataIdFromObject({
        edges: [
          {
            node: {
              slug: "test",
              __typename: "TestType",
            },
          },
        ],
      }),
      undefined
    );
  });
});
