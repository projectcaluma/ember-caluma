import EmberObject from "@ember/object";
import CalumaApolloServiceMixinMixin from "ember-caluma-form-builder/mixins/caluma-apollo-service-mixin";
import { module, test } from "qunit";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import introspectionQueryResultData from "ember-caluma-form-builder/-private/fragment-types";

module("Unit | Mixin | caluma-apollo-service-mixin", function() {
  test("it works", function(assert) {
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
});
