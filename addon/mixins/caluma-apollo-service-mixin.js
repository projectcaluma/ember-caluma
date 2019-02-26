import { computed } from "@ember/object";
import Mixin from "@ember/object/mixin";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject
} from "apollo-cache-inmemory";
import introspectionQueryResultData from "ember-caluma-form-builder/-private/fragment-types";

export default Mixin.create({
  cache: computed(
    () =>
      new InMemoryCache({
        fragmentMatcher: new IntrospectionFragmentMatcher({
          introspectionQueryResultData
        }),
        dataIdFromObject: obj => {
          if (obj.slug) {
            obj = Object.assign({}, obj, { _id: obj.slug });
          }

          return defaultDataIdFromObject(obj);
        }
      })
  )
});
