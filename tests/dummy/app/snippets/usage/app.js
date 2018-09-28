const App = Application.extend({
  // ...

  engines: {
    emberCalumaFormBuilder: {
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
