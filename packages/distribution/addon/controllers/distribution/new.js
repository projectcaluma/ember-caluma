import Controller from "@ember/controller";
import { dedupeTracked, cached } from "tracked-toolbox";

import config from "@projectcaluma/ember-distribution/config";

export default class DistributionNewController extends Controller {
  @config config;

  queryParams = ["types", "search"];

  @dedupeTracked types = String(this.config.new.defaultTypes);
  @dedupeTracked search = "";

  @cached
  get selectedTypes() {
    return this.types.split(",");
  }

  set selectedTypes(value) {
    this.types = String(value);
  }
}
