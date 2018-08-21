"use strict";

module.exports = function(environment) {
  let ENV = {
    modulePrefix: "dummy",
    environment,
    rootURL: "/",
    locationType: "router-scroll",
    historySupportMiddleware: true,
    apollo: {
      apiURL: "/graphql"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
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
    ENV.rootURL = "ADDON_DOCS_ROOT_URL";

    ENV["ember-cli-mirage"] = { enabled: true };

    ENV.apollo.apiURL =
      "https://projectcaluma.github.io/ember-caluma-form-builder/graphql";
  }

  return ENV;
};
