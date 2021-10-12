import Application from "@ember/application";
import config from "dummy/config/environment";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  engines = {
    "@projectcaluma/ember-distribution": {
      dependencies: {
        services: ["apollo", "notification", "intl", "caluma-options"],
      },
    },
  };
}

loadInitializers(App, config.modulePrefix);
