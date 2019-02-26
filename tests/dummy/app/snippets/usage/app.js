const App = Application.extend({
  // ...

  engines: {
    emberCaluma: {
      dependencies: {
        services: [
          "apollo", // ember-apollo-client for graphql
          "notification", // ember-uikit for notifications
          "router" // ember router for navigation
        ]
      }
    }
  }
});
