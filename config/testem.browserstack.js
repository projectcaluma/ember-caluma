"use strict";

const project = ["-p", require("./package.json").name];

module.exports = {
  test_page: "tests/index.html?hidepassed&hideskipped&timeout=60000",
  disable_watching: true,
  parallel: 5,

  reporter: require("testem-failure-only-reporter/grouped-by-browser"),
  framework: "qunit",
  timeout: 600,
  browser_start_timeout: 2000,
  browser_disconnect_timeout: 120,
  launch_in_ci: [
    "BS_Chrome_Current",
    "BS_Firefox_Current",
    "BS_Safari_Current",
    "BS_MS_Edge",
  ],
  launch_in_dev: [],
  launchers: {
    BS_Chrome_Current: {
      exe: "node_modules/.bin/browserstack-launch",
      args: [
        "--os",
        "Windows",
        "--osv",
        "10",
        "--b",
        "chrome",
        "--bv",
        "latest",
        "-t",
        "1200",
        "--u",
        "<url>",
        ...project,
      ],
      protocol: "browser",
    },
    BS_Firefox_Current: {
      exe: "node_modules/.bin/browserstack-launch",
      args: [
        "--os",
        "Windows",
        "--osv",
        "10",
        "--b",
        "firefox",
        "--bv",
        "latest",
        "-t",
        "1200",
        "--u",
        "<url>",
        ...project,
      ],
      protocol: "browser",
    },
    BS_Safari_Current: {
      exe: "node_modules/.bin/browserstack-launch",
      args: [
        "--os",
        "OS X",
        "--osv",
        "Mojave",
        "--b",
        "safari",
        "--bv",
        "latest",
        "-t",
        "1200",
        "--u",
        "<url>",
        ...project,
      ],
      protocol: "browser",
    },
    BS_MS_Edge: {
      exe: "node_modules/.bin/browserstack-launch",
      args: [
        "--os",
        "Windows",
        "--osv",
        "10",
        "--b",
        "edge",
        "--bv",
        "latest",
        "-t",
        "1200",
        "--u",
        "<url>",
        ...project,
      ],
      protocol: "browser",
    },
  },
};
