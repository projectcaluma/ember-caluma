import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { useResource } from "ember-resources";

import FetchAnalyticsTableResource from "@projectcaluma/ember-analytics/resources/analytics-table";

export default class ReportsNewController extends Controller {
  @queryManager apollo;

  @tracked data = useResource(this, FetchAnalyticsTableResource, () => [
    this.model,
  ]);
}
