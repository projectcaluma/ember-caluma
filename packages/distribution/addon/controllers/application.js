import Controller from "@ember/controller";
import { inject as service } from "@ember/service";

import config from "@projectcaluma/ember-distribution/config";

export default class ApplicationController extends Controller {
  @config config;

  @service distribution;
}
