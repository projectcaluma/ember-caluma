# Installation

There are various addons for using Caluma in Ember.js:

- **@projectcaluma/ember-core:** core addon, will be installed automatically
- **@projectcaluma/ember-form:** everything for rendering forms
- **@projectcaluma/ember-form-builder:** engine for building forms
- **@projectcaluma/ember-workflow:** everything for working with the workflow
- **@projectcaluma/ember-testing:** testing utilitites

Choose your needed packages and install them:

```bash
ember install @projectcaluma/ember-form
```

# Usage

To use any `@projectcaluma` package you need to customize the apollo service in
order to support [fragments on unions and interfaces](https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher).
Create a new service `app/services/apollo.js` and extend the apollo service with
the provided mixin:

{{docs-snippet name='usage/apollo.js'}}

To make `@projectcaluma/ember-form-builder` work a few steps must be followed.
The form builder is a [routable engine](http://ember-engines.com) which must be
mounted in `app/router.js`:

{{docs-snippet name='usage/router.js'}}

Then pass the needed services for the form builder:

{{docs-snippet name='usage/app.js'}}

Last but not least import `ember-uikit` and `@projectcaluma/ember-form-builder`
and / or `@projectcaluma/ember-form` to apply styling in `app/styles/app.scss`:

{{docs-snippet name='usage/app.scss'}}

The `$modal-z-index` variable is needed to keep the `ember-power-select`
dropdown above modal dialogs as the default of z-index of `1010`
(intentionally) dwarfs all other indexes.

# Build time configuration

`@projectcaluma/ember-form-builder` relies heavily on `ember-changeset` and
`ember-changeset-validations` that use `Proxy`.

`ember-in-viewport` is also being used in `@projectcaluma/ember-workflow`, which
relies on `IntersectionObserver`. Since we support IE11+ we include a polyfill
for `Proxy` and `IntersectionObserver` per default.

If your app doesn't need that, you can opt-out by configuring
`ember-caluma.includeProxyPolyfill` and
`ember-caluma.includeIntersectionObserverPolyfill` in your `ember-cli-build.js`
file:

{{docs-snippet name='config/ember-cli-build.js'}}
