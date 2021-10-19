import { InMemoryCache } from "@apollo/client/cache";
import EmberObject from "@ember/object";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import possibleTypes from "@projectcaluma/ember-core/-private/possible-types";
import CalumaApolloServiceMixinMixin from "@projectcaluma/ember-core/mixins/caluma-apollo-service-mixin";

module("Unit | Mixin | caluma-apollo-service-mixin", function (hooks) {
  setupTest(hooks);

  test("it uses the correct possible types", function (assert) {
    assert.expect(2);

    const CalumaApolloServiceMixinObject = EmberObject.extend(
      CalumaApolloServiceMixinMixin
    );

    const subject = CalumaApolloServiceMixinObject.create();

    const cache = subject.cache();

    assert.ok(cache instanceof InMemoryCache);
    assert.deepEqual(cache.config.possibleTypes, possibleTypes);
  });

  test("it resolves the correct data id", function (assert) {
    assert.expect(2);

    const CalumaApolloServiceMixinObject = EmberObject.extend(
      CalumaApolloServiceMixinMixin
    );

    const subject = CalumaApolloServiceMixinObject.create();

    const cache = subject.cache();

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
