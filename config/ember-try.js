"use strict";

/* eslint-disable node/no-extraneous-require */
const { embroiderSafe, embroiderOptimized } = require("@embroider/test-setup");
const getChannelURL = require("ember-source-channel-url");

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: "ember-lts-3.24",
        npm: {
          devDependencies: {
            "ember-source": "~3.24.3",
          },
        },
      },
      {
        // pin version to 3.28.1 since 3.28.2 produces errors in CI
        // https://github.com/emberjs/ember.js/issues/19797
        name: "ember-lts-3.28",
        npm: {
          devDependencies: {
            "ember-source": "3.28.1",
          },
          resolutions: {
            "ember-source": "3.28.1",
          },
        },
      },
      {
        name: "ember-release",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("release"),
          },
        },
      },
      {
        name: "ember-beta",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("beta"),
          },
        },
      },
      {
        name: "ember-canary",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("canary"),
          },
        },
      },
      {
        name: "ember-default-with-jquery",
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            "jquery-integration": true,
          }),
        },
        npm: {
          devDependencies: {
            "@ember/jquery": "^1.1.0",
          },
        },
      },
      {
        name: "ember-classic",
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            "application-template-wrapper": true,
            "default-async-observers": false,
            "template-only-glimmer-components": false,
          }),
        },
        npm: {
          ember: {
            edition: "classic",
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
