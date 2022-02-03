export default class App extends Application {
  // ...

  engines = {
    "@projectcaluma/ember-form-builder": {
      dependencies: {
        services: [
          "apollo", // ember-apollo-client for graphql
          "notification", // ember-uikit for notifications
          "intl", // ember-intl for i18n
          "caluma-options", // service to configure ember-caluma
        ],
      },
    },
  };
}
