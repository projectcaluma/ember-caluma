import AddonDocsRouter, { docsRoute } from "ember-cli-addon-docs/router";
import config from "./config/environment";

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  docsRoute(this, function() {
    this.route("usage");
    this.route("maintenance");
  });

  this.route("demo", function() {
    this.mount("ember-caluma-form-builder", {
      path: "/form-builder",
      as: "form-builder"
    });
  });
});

export default Router;
