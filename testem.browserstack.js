const projectName = require("./package.json").name;

module.exports = Object.assign({}, require("./testem"), {
  timeout: 1200,
  browser_start_timeout: 2000,
  browser_disconnect_timeout: 300,
  launch_in_ci: ["BS_Edge_Current", "BS_IE_11"],
  launchers: {
    BS_Edge_Current: {
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
        "-p",
        projectName,
        "--u",
        "<url>"
      ],
      protocol: "browser"
    },
    BS_IE_11: {
      exe: "node_modules/.bin/browserstack-launch",
      args: [
        "--os",
        "Windows",
        "--osv",
        "10",
        "--b",
        "ie",
        "--bv",
        "11.0",
        "-t",
        "1200",
        "-p",
        projectName,
        "--u",
        "<url>"
      ],
      protocol: "browser"
    }
  }
});
