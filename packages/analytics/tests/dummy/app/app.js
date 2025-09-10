import Application from "@ember/application";
import { importSync, isDevelopingApp, macroCondition } from "@embroider/macros";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "dummy/config/environment";

if (macroCondition(isDevelopingApp())) {
  importSync("./deprecation-workflow");
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  engines = {
    "@projectcaluma/ember-analytics": {
      dependencies: {
        services: ["apollo", "notification", "intl"],
      },
    },
  };
}

loadInitializers(App, config.modulePrefix);
