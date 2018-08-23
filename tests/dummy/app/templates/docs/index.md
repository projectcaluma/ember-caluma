# Installation

```bash
ember install ember-caluma-form-builder
```

# Usage

`ember-caluma-form-builder` is a [routable engine](http://ember-engines.com).
To include it in your application just mount it in your `app/router.js` and
add dependencies in `app/app.js` and modify the apollo service with a mixin:

{{#docs-demo as |demo|}}
{{demo.snippet 'usage/router.js' label='app/router.js'}}
{{demo.snippet 'usage/app.js' label='app/app.js'}}
{{demo.snippet 'usage/apollo.js' label='app/services/apollo.js'}}
{{/docs-demo}}
