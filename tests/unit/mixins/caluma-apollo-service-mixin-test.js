import EmberObject from "@ember/object";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import introspectionQueryResultData from "ember-caluma/-private/fragment-types";
import CalumaApolloServiceMixinMixin from "ember-caluma/mixins/caluma-apollo-service-mixin";
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Mixin | caluma-apollo-service-mixin", function(hooks) {
  setupTest(hooks);

  test("it uses the correct fragment matcher", function(assert) {
    assert.expect(4);

    let CalumaApolloServiceMixinObject = EmberObject.extend(
      CalumaApolloServiceMixinMixin
    );

    let subject = CalumaApolloServiceMixinObject.create();

    assert.ok(subject.get("cache") instanceof InMemoryCache);
    assert.ok(
      subject.get("cache.config.fragmentMatcher") instanceof
        IntrospectionFragmentMatcher
    );

    assert.deepEqual(
      subject.get("cache.config.fragmentMatcher.possibleTypesMap.Node"),
      introspectionQueryResultData.__schema.types
        .find(({ name }) => name === "Node")
        .possibleTypes.map(({ name }) => name)
    );

    assert.deepEqual(
      subject.get("cache.config.fragmentMatcher.possibleTypesMap.Answer"),
      introspectionQueryResultData.__schema.types
        .find(({ name }) => name === "Answer")
        .possibleTypes.map(({ name }) => name)
    );
  });

  test("it resolves the correct data id", function(assert) {
    assert.expect(2);

    let CalumaApolloServiceMixinObject = EmberObject.extend(
      CalumaApolloServiceMixinMixin
    );

    let subject = CalumaApolloServiceMixinObject.create();

    assert.equal(
      subject.get("cache.config.dataIdFromObject")({
        slug: "test",
        __typename: "TestType"
      }),
      "TestType:test"
    );

    assert.equal(
      subject.get("cache.config.dataIdFromObject")({
        edges: [
          {
            node: {
              slug: "test",
              __typename: "TestType"
            }
          }
        ]
      }),
      null
    );
  });
});
