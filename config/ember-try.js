"use strict";

const getChannelURL = require("ember-source-channel-url");

module.exports = async function() {
  return {
    useYarn: true,
    scenarios: [
      {
        name: "ember-lts-3.8",
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            "jquery-integration": true
          })
        },
        npm: {
          devDependencies: {
            "@ember/jquery": "^0.5.1",
            "ember-source": "~3.8.0"
          }
        }
      },
      {
        name: "ember-lts-3.12",
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            "jquery-integration": true
          })
        },
        npm: {
          devDependencies: {
            "@ember/jquery": "^0.6.0",
            "ember-source": "~3.12.0"
          }
        }
      },
      {
        name: "ember-release",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("release")
          }
        }
      },
      {
        name: "ember-beta",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("beta")
          }
        }
      },
      {
        name: "ember-canary",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("canary")
          }
        }
      }
    ]
  };
};
