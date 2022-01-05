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

To make `@projectcaluma/ember-form-builder` work a few steps must be followed.
The form builder is a [routable engine](http://ember-engines.com) which must be
mounted in `app/router.js`:

{{docs-snippet name='router.js'}}

Then pass the needed services for the form builder:

{{docs-snippet name='app.js'}}

Last but not least import `ember-uikit` and `@projectcaluma/ember-form-builder`
and / or `@projectcaluma/ember-form` to apply styling in `app/styles/app.scss`:

{{docs-snippet name='app.scss'}}

The `$modal-z-index` variable is needed to keep the `ember-power-select`
dropdown above modal dialogs as the default of z-index of `1010`
(intentionally) dwarfs all other indexes.
