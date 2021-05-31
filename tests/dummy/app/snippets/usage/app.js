const App = Application.extend({
  // ...

  engines: {
    "ember-caluma": {
      dependencies: {
        services: [
          "apollo", // ember-apollo-client for graphql
          "notification", // ember-uikit for notifications
          "router", // ember router for navigation
          "intl", // ember-intl for i18n
          "caluma-options", // service to configure ember-caluma
          "validator", // service for generic regex validation
        ],
      },
    },
  },
});
