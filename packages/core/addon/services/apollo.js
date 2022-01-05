import { InMemoryCache, defaultDataIdFromObject } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { inject as service } from "@ember/service";
import ApolloService from "ember-apollo-client/services/apollo";

import possibleTypes from "@projectcaluma/ember-core/-private/possible-types";

export default class CalumaApolloService extends ApolloService {
  @service intl;

  cache() {
    return new InMemoryCache({
      possibleTypes,
      dataIdFromObject: (obj) =>
        defaultDataIdFromObject({
          ...obj,
          _id: obj.slug || obj._id,
        }),
    });
  }

  link() {
    const httpLink = super.link();

    const localeLink = setContext((request, context) => ({
      ...context,
      headers: {
        ...context.headers,
        language: this.intl.primaryLocale,
        "accept-language": this.intl.primaryLocale,
      },
    }));

    return localeLink.concat(httpLink);
  }
}
