module.exports = {
  test_page: "tests/index.html?hidepassed",
  disable_watching: true,
  parallel: 2,
  reporter: "dot",
  framework: "qunit",
  launch_in_ci: ["Chrome", "Firefox"],
  launch_in_dev: [],
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? "--no-sandbox" : null,
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-software-rasterizer",
        "--mute-audio",
        "--remote-debugging-port=0",
        "--window-size=1440,900"
      ].filter(Boolean)
    },
    Firefox: {
      ci: ["-headless", "--window-size=1440,900"]
    }
  }
};
