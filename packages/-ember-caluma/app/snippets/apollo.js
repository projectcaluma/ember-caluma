import ApolloService from "ember-apollo-client/services/apollo";

import CalumaApolloServiceMixin from "@projectcaluma/ember-core/mixins/caluma-apollo-service-mixin";

export default class CustomApolloService extends ApolloService.extend(
  CalumaApolloServiceMixin,
  {}
) {}
