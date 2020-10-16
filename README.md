# ![ember-caluma](https://user-images.githubusercontent.com/6150577/60805349-1e6f3080-a180-11e9-911f-874620aa72b1.png)

![Test](https://github.com/projectcaluma/ember-caluma/workflows/Test/badge.svg)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=OFpCTnVaaUhTWTU3SFBKMGdtS1hFeCtCMUgvMmdMSTZqVVNEejhrME5JND0tLUp6R3B6aEJhUjBRRUtxSjJxcFhVb3c9PQ==--234eac4a0f5f7c3759bf207a1ab7954f6bbaf078)](https://automate.browserstack.com/public-build/OFpCTnVaaUhTWTU3SFBKMGdtS1hFeCtCMUgvMmdMSTZqVVNEejhrME5JND0tLUp6R3B6aEJhUjBRRUtxSjJxcFhVb3c9PQ==--234eac4a0f5f7c3759bf207a1ab7954f6bbaf078)
[![Codecov](https://codecov.io/gh/projectcaluma/ember-caluma/branch/master/graph/badge.svg)](https://codecov.io/gh/projectcaluma/ember-caluma)
[![npm](https://img.shields.io/npm/v/ember-caluma.svg)](https://www.npmjs.com/package/ember-caluma)
[![Dependabot](https://badgen.net/dependabot/projectcaluma/ember-caluma/?icon=dependabot)](https://dependabot.com/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://spdx.org/licenses/LGPL-3.0-or-later.html)

The Ember.js addon for [Caluma](https://caluma.io) - a collaborative form editing service.

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>iOS Safari |
| --------- | --------- | --------- | --------- |
| IE11, Edge| last version| last version| last version


## Compatibility

`ember-caluma` is guaranteed to work with the **last LTS version** of Ember.js (currently 3.20).

## Documentation

You can find the interactive documentation [here](https://caluma.io/ember-caluma).

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

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

### Updating the schema

The addon includes a mirage server for mocking Caluma's GraphQL API, which is generated from the GraphQL schema definition. If the upstream GraphQL schema changed you can update the addon by running

```bash
yarn update-schema
yarn update-fragment-types
```

### History

This addon is the result of a merge of three different addons:

* [ember-caluma-form-builder](https://github.com/projectcaluma/ember-caluma-form-builder)
* [ember-caluma-form](https://github.com/projectcaluma/ember-caluma-form)
* [ember-caluma-utils](https://github.com/projectcaluma/ember-caluma-utils)

The history of `ember-caluma-form` and `ember-caluma-utils` has not been preserved during the merge.

## License

This project is licensed under the [LGPL-3.0-or-later license](LICENSE).

For further information on our license choice, you can read up on the [corresponding GitHub issue](https://github.com/projectcaluma/ember-caluma/issues/613).
