import Application from "@ember/application";
import config from "dummy/config/environment";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  engines = {
    "@projectcaluma/ember-form-builder": {
      dependencies: {
        services: [
          "apollo",
          "notification",
          "router",
          "intl",
          "caluma-options",
          "validator",
        ],
      },
    },
  };
}

loadInitializers(App, config.modulePrefix);
