# ember-caluma-form-builder

[![Build Status](https://travis-ci.com/projectcaluma/ember-caluma-form-builder.svg?branch=master)](https://travis-ci.com/projectcaluma/ember-caluma-form-builder)
[![Codecov](https://codecov.io/gh/projectcaluma/ember-caluma-form-builder/branch/master/graph/badge.svg)](https://codecov.io/gh/projectcaluma/ember-caluma-form-builder)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The form builder for [Caluma](https://projectcaluma.github.io) - a collaborative form editing service.

## Installation

```bash
$ ember install ember-caluma-form-builder
```

## Usage

### Simple

`ember-caluma-form-builder` is a routable [ember engine](http://ember-engines.com). To include it in your application just mount it in your `app/router.js`:

```javascript
// app/router.js

Router.map(function() {
  this.mount("ember-caluma-form-builder", { path: "/form-builder" });
});
```

### Advanced

[TODO]

## Contributing

### Installation

- `git clone git@github.com:projectcaluma/ember-caluma-form-builder`
- `cd ember-caluma-form-builder`
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

## License

This project is licensed under the [MIT License](LICENSE.md).
