import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import ENV from "ember-caluma/config/environment";
import query from "ember-caluma/gql/queries/distribution-case.graphql";

export default class ApplicationController extends Controller {
  @service router;

  @queryManager apollo;

  get showDistribution() {
    // TODO: remove when distribution is V1
    return ENV.environment !== "production";
  }

  @action
  async goToDistribution() {
    const response = await this.apollo.query({ query });
    const rawId = response.allCases.edges[0]?.node.id;
    const id = rawId ? decodeId(rawId) : null;

    if (id) {
      this.router.transitionTo("demo.distribution.distribution", id);
    }
  }
}
