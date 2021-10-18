# ![ember-caluma](https://user-images.githubusercontent.com/6150577/137114875-8b9edb83-92ba-4b3a-ba6e-2e5f86afdcc5.png)

[![Test](https://github.com/projectcaluma/ember-caluma/workflows/Test/badge.svg)](https://github.com/projectcaluma/ember-caluma/actions?query=workflow%3ATest)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=RFNMT2hyTnRjNVZkUitkWUl2d3BWK21KbnU3MU1tTGpHS2tOVHVCU1RrZz0tLXJjZ1J5VEZ6ZmtJWVpFdHpDRnREcFE9PQ==--3034affde596526379b7a0a19798a7ba1f79154c)](https://automate.browserstack.com/public-build/RFNMT2hyTnRjNVZkUitkWUl2d3BWK21KbnU3MU1tTGpHS2tOVHVCU1RrZz0tLXJjZ1J5VEZ6ZmtJWVpFdHpDRnREcFE9PQ==--3034affde596526379b7a0a19798a7ba1f79154c)
[![Codecov](https://codecov.io/gh/projectcaluma/ember-caluma/branch/main/graph/badge.svg)](https://codecov.io/gh/projectcaluma/ember-caluma)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://spdx.org/licenses/LGPL-3.0-or-later.html)

The Ember.js addons for [Caluma](https://caluma.io) - a collaborative form editing service.

## Browser support

| ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png) |
| :-------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
|                                                                   11                                                                    |                                        last 2 versions                                        |                                            last 2 versions                                             |                                           last 2 versions                                           |                                               last 2 versions                                               |

## Compatibility

`ember-caluma` is guaranteed to work with the **last LTS version** of Ember.js (currently 3.24).

## Documentation

You can find the interactive documentation [here](https://docs.caluma.io/ember-caluma).

## Contributing

### Installation

- `git clone git@github.com:projectcaluma/ember-caluma`
- `cd ember-caluma`
- `yarn install`

### Linting

- `yarn lint`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

Cross-browser testing provided by:

<a href="https://browserstack.com"><img alt="BrowserStack" src="https://user-images.githubusercontent.com/6150577/69328224-24f1d680-0c4f-11ea-8b02-5670334923a3.png" height="50"></a>

### Running the dummy application

#### With a mocked [Mirage.js](https://github.com/miragejs/ember-cli-mirage) backend

- `yarn start`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

#### With a dockerized [Caluma](https://github.com/projectcaluma/caluma) backend

- `docker-compose up -d`
- `yarn start-proxy`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

### Updating the schema

The addon includes a mirage server for mocking Caluma's GraphQL API, which is generated from the GraphQL schema definition. If the upstream GraphQL schema changed you can update the addon by running

```bash
yarn update-schema
yarn update-possible-types
```

### Releasing

To release a new version, head over to [Actions](https://github.com/projectcaluma/ember-caluma/actions?query=workflow%3ARelease) and trigger a workflow run.
This will automatically check if a new version can be released, generate a changelog, draft a release and publish it on NPM.

## License

This project is licensed under the [LGPL-3.0-or-later license](LICENSE).

For further information on our license choice, you can read up on the [corresponding GitHub issue](https://github.com/projectcaluma/ember-caluma/issues/613).
