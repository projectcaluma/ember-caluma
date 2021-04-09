# Installation

```bash
ember install ember-caluma
```

# Usage

To make `ember-caluma` work a few steps must be followed. The
form builder is a [routable engine](http://ember-engines.com) which must be
mounted in `app/router.js`:

{{docs-snippet name='usage/router.js'}}

To make `ember-apollo-client` work, we need to pass it as dependency for our
engine in `app/app.js`. Additionally, we need to specify `ember-intl` as a
dependency so that the the application has access to the addon's translations.

{{docs-snippet name='usage/app.js'}}

Also, since our form builder needs to customize the apollo service in order to
support [fragments on unions and interfaces](https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher),
create a new service `app/services/apollo.js` and extend the apollo service
with the provided mixin:

{{docs-snippet name='usage/apollo.js'}}

Last but not least import `ember-uikit` and `ember-caluma` to
apply styling in `app/styles/app.scss`:

{{docs-snippet name='usage/app.scss'}}

The `$modal-z-index` variable is needed to keep the `ember-power-select`
dropdown above modal dialogs as the default of z-index of `1010`
(intentionally) dwarfs all other indexes.

# Build time configuration

`ember-caluma` relies heavily on `ember-changeset` and
`ember-changeset-validations` that use `Proxy`. Since we support IE11+ we
include a polyfill for `Proxy` per default. If your app doesn't need that,
you can opt-out by configuring `ember-caluma.includeProxyPolyfill` in your
`ember-cli-build.js` file:

{{docs-snippet name='config/ember-cli-build.js'}}
