# Migration from v9 / v10 to v11

The new version v11 bears some breaking changes concerning the library layer of
the form rendering. In v11 the form library layer was completely rewritten with
native classes and proper tracking instead of the deprecated `EmberObject` with
computed properties. To adapt the new version, some patterns need to be
addressed if the consuming app customized the form rendering.

## Creating form library models

_This is only relevant if the consuming app manually created instances of form
library models._

Since the new library layer uses native classes instead of `EmberObject`, the
`create` method now doesn't exist anymore. Instead, the object will now be
created by instatiating the class as usual in modern JavaScript. However, to
allow those objects to inject services, the `owner` (container) needs to be
passed manually.

**Before:**

```js
const document = getOwner(this)
  .factoryFor("caluma-model:document")
  .create({ raw });
```

**After:**

```js
const owner = getOwner(this);
const Document = owner.factoryFor("caluma-model:document").class;

const document = new Document({ raw, owner });
```

## Customizing form library models

_This is only relevant if the consuming app customized form library models._

Since the library layer is now written in native classes, all customizations of
such models need to be converted to classes as well.

**Before:**

```js
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Field from "@projectcaluma/ember-form/lib/field";

export default Field.extends({
  toggler: service(),

  hidden: computed("toggler.hideTextQuestions", function () {
    if (
      this.toggler.hideTextQuestions &&
      this.question.__typename === "TextQuestion"
    ) {
      return true;
    }

    return this._super.hidden;
  }),
});
```

**After:**

```js
import { inject as service } from "@ember/service";
import Field from "@projectcaluma/ember-form/lib/field";
import { cached } from "tracked-toolbox";

export default class CustomField extends Field {
  @service toggler;

  @cached
  get hidden() {
    if (
      this.toggler.hideTextQuestions &&
      this.question.raw.__typename === "TextQuestion"
    ) {
      return true;
    }

    return super.hidden;
  }
}
```

## Accessing properties of form library models

_This is likely to be relevant if the consuming app used the library layer
internally or if it provided custom widgets._

In previous versions of the form library it was possible to access the raw
properties provided by the backend on the model directly. Since some of those
clashed names with custom properties on the models, the raw GraphQL data is now
stored within the `raw` property of the model. This already works in previous
versions, the direct approach was merely a shortcut that we needed to remove.
The only property that can still be accessed directly for convenience is the
`slug` on forms and questions.

**Before:**

```hbs
{{! my-widget.hbs }}
<label>
  {{@field.question.label}}
  ({{@field.question.slug}}):
</label>
<p>
  {{@field.question.meta.custom}}
</p>
```

**After:**

```hbs
{{! my-widget.hbs }}
<label>
  {{@field.question.raw.label}}
  ({{@field.question.slug}}):
</label>
<p>
  {{@field.question.raw.meta.custom}}
</p>
```

## Removal of CalumaApolloServiceMixin

The `CalumaApolloServiceMixin` was removed since mixins will be deprecated.
Instead, `@projectcaluma/ember-core` will directly override the apollo service.
If the consuming app further configured the service (with e.g. authorization) it
will need to directly extend the service from caluma:

**Before:**

```js
import { inject as service } from "@ember/service";
import CalumaApolloServiceMixin from "@projectcaluma/ember-core/mixins/caluma-apollo-service-mixin";
import ApolloService from "ember-apollo-client/services/apollo";

export default class CustomApolloService extends ApolloService.extend(
  CalumaApolloServiceMixin,
  {}
) {
  @service session;

  link() {
    const httpLink = super.link();

    const authMiddleware = setContext((request, context) => ({
      ...context,
      headers: {
        authorization: `Bearer ${this.session.authorized.token}`,
        ...context.headers,
      },
    }));

    return authMiddleware.concat(httpLink);
  }
}
```

**After:**

```js
import { inject as service } from "@ember/service";
import CalumaApolloService from "@projectcaluma/ember-core/services/apollo";

export default class CustomApolloService extends CalumaApolloService {
  @service session;

  link() {
    const httpLink = super.link();

    const authMiddleware = setContext((request, context) => ({
      ...context,
      headers: {
        authorization: `Bearer ${this.session.authorized.token}`,
        ...context.headers,
      },
    }));

    return authMiddleware.concat(httpLink);
  }
}
```
