import { importSync } from "@embroider/macros";
import { setupEngine } from "ember-engines/test-support";
import { setupIntl } from "ember-intl/test-support";
import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
} from "ember-qunit";

function setApplicationInstance() {
  const application = importSync(
    "@projectcaluma/ember-form-builder/-private/application",
  ).default;

  application.instance = this.owner;
}

// This file exists to provide wrappers around ember-qunit's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);
  setupIntl(hooks, "en");

  hooks.beforeEach(setApplicationInstance);

  // Additional setup for application tests can be done here.
  //
  // For example, if you need an authenticated session for each
  // application test, you could do:
  //
  // hooks.beforeEach(async function () {
  //   await authenticateSession(); // ember-simple-auth
  // });
  //
  // This is also a good place to call test setup functions coming
  // from other addons:
  //
  // setupIntl(hooks, 'en-us'); // ember-intl
  // setupMirage(hooks); // ember-cli-mirage
}

function setupRenderingTest(hooks, options) {
  upstreamSetupRenderingTest(hooks, options);
  setupIntl(hooks, "en");
  setupEngine(hooks, "@projectcaluma/ember-form-builder");

  hooks.beforeEach(setApplicationInstance);
}

function setupTest(hooks, options) {
  upstreamSetupTest(hooks, options);
  setupIntl(hooks, "en");
  setupEngine(hooks, "@projectcaluma/ember-form-builder");

  hooks.beforeEach(setApplicationInstance);
}

export { setupApplicationTest, setupRenderingTest, setupTest };
