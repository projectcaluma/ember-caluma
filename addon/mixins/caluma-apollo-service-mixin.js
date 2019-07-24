import { computed } from "@ember/object";
import Mixin from "@ember/object/mixin";
import { inject as service } from "@ember/service";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject
} from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import introspectionQueryResultData from "ember-caluma/-private/fragment-types";

export default Mixin.create({
  intl: service(),

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
  ),

  link: computed(function() {
    let httpLink = this._super(...arguments);

    let localeLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        language: this.get("intl.locale"),
        "accept-language": this.get("intl.locale")
      }
    }));

    return localeLink.concat(httpLink);
  })
});
