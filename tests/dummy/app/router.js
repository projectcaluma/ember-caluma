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
    this.route("migration");
    this.route("buttons");
  });

  this.route("demo", function () {
    this.route("form");
    this.route("queries");

    this.mount("ember-caluma", {
      path: "/form-builder",
      as: "form-builder",
    });
  });
});
