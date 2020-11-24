import Mixin from "@ember/object/mixin";
import { inject as service } from "@ember/service";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject,
} from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

import introspectionQueryResultData from "ember-caluma/-private/fragment-types";

export default Mixin.create({
  intl: service(),

  cache() {
    return new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData,
      }),
      dataIdFromObject: (obj) => {
        if (obj.slug) {
          obj = Object.assign({}, obj, { _id: obj.slug });
        }
        return defaultDataIdFromObject(obj);
      },
    });
  },

  link(...args) {
    const httpLink = this._super(...args);

    const localeLink = setContext((request, context) => ({
      ...context,
      headers: {
        ...context.headers,
        language: this.intl.primaryLocale,
        "accept-language": this.intl.primaryLocale,
      },
    }));

    return localeLink.concat(httpLink);
  },
});
