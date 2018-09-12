import Mixin from "@ember/object/mixin";
import { computed } from "@ember/object";
import introspectionQueryResultData from "ember-caluma-form-builder/-private/fragment-types";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";

// TODO: maybe extract this service into a general caluma utils addon
export default Mixin.create({
  cache: computed(
    () =>
      new InMemoryCache({
        fragmentMatcher: new IntrospectionFragmentMatcher({
          introspectionQueryResultData
        })
      })
  )
});
