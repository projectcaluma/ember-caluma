# ember-caluma

[![Build Status](https://travis-ci.com/projectcaluma/ember-caluma.svg?branch=master)](https://travis-ci.com/projectcaluma/ember-caluma)
[![npm](https://img.shields.io/npm/v/ember-caluma.svg)](https://www.npmjs.com/package/ember-caluma)
[![Codecov](https://codecov.io/gh/projectcaluma/ember-caluma/branch/master/graph/badge.svg)](https://codecov.io/gh/projectcaluma/ember-caluma)
[![dependencies Status](https://david-dm.org/projectcaluma/ember-caluma/status.svg)](https://david-dm.org/projectcaluma/ember-caluma)
[![devDependencies Status](https://david-dm.org/projectcaluma/ember-caluma/dev-status.svg)](https://david-dm.org/projectcaluma/ember-caluma?type=dev)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The Ember.js addon for [Caluma](https://projectcaluma.github.io) - a collaborative form editing service.

## Documentation

You can find the interactive documentation [here](https://projectcaluma.github.io/ember-caluma).

## Contributing

### Installation

- `git clone git@github.com:projectcaluma/ember-caluma`
- `cd ember-caluma`
- `yarn install`

### Linting

- `yarn lint:js`
- `yarn lint:js --fix`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

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

This project is licensed under the [MIT License](LICENSE).
