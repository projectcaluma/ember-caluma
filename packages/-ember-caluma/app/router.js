import AddonDocsRouter, { docsRoute } from "ember-cli-addon-docs/router";

import config from "./config/environment";

export default class Router extends AddonDocsRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

// eslint-disable-next-line array-callback-return
Router.map(function () {
  docsRoute(this, function () {
    this.route("usage");
    this.route("testing");
    this.route("queries");
    this.route("buttons");
    this.route("validation");

    this.route("migration-v7");
    this.route("migration-v9");
  });

  this.route("demo", function () {
    this.route("form-rendering");
    this.route("queries");

    this.mount("@projectcaluma/ember-form-builder", {
      path: "/form-builder",
      as: "form-builder",
    });
  });
});
