import Engine from "ember-engines/engine";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "./config/environment";

const { modulePrefix } = config;

export default class DistributionEngine extends Engine {
  modulePrefix = modulePrefix;
  Resolver = Resolver;

  dependencies = {
    services: [
      "apollo",
      "notification",
      "intl",
      "caluma-options",
      // this is just in case that a custom form widget uses the store or fetch service
      "store",
      "fetch",
    ],
  };
}

loadInitializers(DistributionEngine, modulePrefix);
