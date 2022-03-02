import Engine from "@ember/engine";

import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "./config/environment";

const { modulePrefix } = config;

export default class YourEngine extends Engine {
  modulePrefix = modulePrefix;
  Resolver = Resolver;
  dependencies = {
    services: ["apollo", "notification", "intl"],
  };
}

loadInitializers(YourEngine, modulePrefix);
