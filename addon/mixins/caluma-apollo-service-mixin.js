import Mixin from "@ember/object/mixin";
import { computed } from "@ember/object";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";

// TODO: maybe extract this service into a general caluma utils addon

export const introspectionQueryResultData = {
  __schema: {
    types: [
      {
        kind: "INTERFACE",
        name: "Node",
        possibleTypes: [{ name: "Form" }, { name: "Question" }]
      }
    ]
  }
};

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
