import Controller from "@ember/controller";

import config from "@projectcaluma/ember-distribution/config";

export default class ApplicationController extends Controller {
  @config config;
}
