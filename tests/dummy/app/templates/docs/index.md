# Installation

```bash
ember install ember-caluma-form-builder
```

# Usage

To make `ember-caluma-form-builder` work a few steps must be followed. The
form builder is a [routable engine](http://ember-engines.com) which must be
mounted in `app/router.js`:

{{docs-snippet name='usage/router.js'}}

To make `ember-apollo-client` work, we need to pass it as dependency for our
engine in `app/app.js`:

{{docs-snippet name='usage/app.js'}}

Also, since our form builder needs to customize the apollo service in order to
support [fragments on unions and interfaces](https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher),
create a new service `app/services/apollo.js` and extend the apollo service
with the provided mixin:

{{docs-snippet name='usage/apollo.js'}}

Last but not least import `ember-uikit` and `ember-caluma-form-builder` to
apply styling in `app/styles/app.scss`:

{{docs-snippet name='usage/app.scss'}}
