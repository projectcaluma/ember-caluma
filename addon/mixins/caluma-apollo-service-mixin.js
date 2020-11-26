import { InMemoryCache, defaultDataIdFromObject } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import Mixin from "@ember/object/mixin";
import { inject as service } from "@ember/service";

import possibleTypes from "ember-caluma/-private/possible-types";

export default Mixin.create({
  intl: service(),

  cache() {
    return new InMemoryCache({
      possibleTypes,
      dataIdFromObject: (obj) =>
        defaultDataIdFromObject({
          ...obj,
          _id: obj.slug || obj._id,
        }),
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
