import Engine from "ember-engines/engine";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "./config/environment";

const { modulePrefix } = config;

export default class FormBuilderEngine extends Engine {
  modulePrefix = modulePrefix;
  Resolver = Resolver;

  dependencies = {
    services: ["apollo", "notification", "intl", "caluma-options", "validator"],
  };
}

loadInitializers(FormBuilderEngine, modulePrefix);
