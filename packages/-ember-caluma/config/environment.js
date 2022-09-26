"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-caluma",
    environment,
    rootURL: "/",
    locationType: "history",
    historySupportMiddleware: true,
    apollo: {
      apiURL: "/graphql",
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    "ember-caluma": {
      powerSelectEnableSearchLimit: 2,
    },
  };

  if (environment === "development") {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    ENV["ember-uikit"] = { notification: { timeout: 1 } };

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;
  }

  if (environment === "production") {
    ENV.rootURL = "/ADDON_DOCS_ROOT_URL/";

    ENV["ember-cli-mirage"] = { enabled: true };
  }

  return ENV;
};
