import EmberObject from "@ember/object";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import introspectionQueryResultData from "ember-caluma/-private/fragment-types";
import CalumaApolloServiceMixinMixin from "ember-caluma/mixins/caluma-apollo-service-mixin";

module("Unit | Mixin | caluma-apollo-service-mixin", function (hooks) {
  setupTest(hooks);

  test("it uses the correct fragment matcher", function (assert) {
    assert.expect(4);

    const CalumaApolloServiceMixinObject = EmberObject.extend(
      CalumaApolloServiceMixinMixin
    );

    const subject = CalumaApolloServiceMixinObject.create();

    const cache = subject.cache();

    assert.ok(cache instanceof InMemoryCache);
    assert.ok(
      cache.config.fragmentMatcher instanceof IntrospectionFragmentMatcher
    );

    assert.deepEqual(
      cache.config.fragmentMatcher.possibleTypesMap.Node,
      introspectionQueryResultData.__schema.types
        .find(({ name }) => name === "Node")
        .possibleTypes.map(({ name }) => name)
    );

    assert.deepEqual(
      cache.config.fragmentMatcher.possibleTypesMap.Answer,
      introspectionQueryResultData.__schema.types
        .find(({ name }) => name === "Answer")
        .possibleTypes.map(({ name }) => name)
    );
  });

  test("it resolves the correct data id", function (assert) {
    assert.expect(2);

    const CalumaApolloServiceMixinObject = EmberObject.extend(
      CalumaApolloServiceMixinMixin
    );

    const subject = CalumaApolloServiceMixinObject.create();

    const cache = subject.cache();

    assert.equal(
      cache.config.dataIdFromObject({
        slug: "test",
        __typename: "TestType",
      }),
      "TestType:test"
    );

    assert.equal(
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
      null
    );
  });
});
