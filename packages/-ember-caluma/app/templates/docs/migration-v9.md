# Migration from v8 to v9

## Update ember-auto-import to v2

We updated to `ember-auto-import` v2 which means that every consuming app needs
to use v2 as well. Please follow the [migration guides](https://github.com/ef4/ember-auto-import/blob/main/docs/upgrade-guide-2.0.md)
of `ember-auto-import` to make sure you're compatible.

## Install new packages

The NPM package `ember-caluma` is now deprecated in favor of more isolated
packages. Please refer to <LinkTo @route="docs.index">the installation
guide</LinkTo> for a complete list of packages. If, for instance, you're using
the form rendering and the form builder, you'll have to remove `ember-caluma`
from your `package.json` and then run:

```bash
ember install @projectcaluma/ember-form-builder @projectcaluma/ember-form
```

This will also install `@projectcaluma/ember-core` and some other dependencies.

## Invocation of form builder

Since the form builder is now a separate package, some changes are needed. In
your apps `router.js`:

```diff
- this.mount("ember-caluma", {
-   path: "/form-builder",
-   as: "form-builder",
- });
+ this.mount("@projectcaluma/ember-form-builder", {
+   path: "/form-builder",
+   as: "form-builder",
+ });
```

In your `app.js`:

```diff
- engines = {
-   "ember-caluma": {
-     dependencies: {
-       services: [
+ engines = {
+   "@projectcaluma/ember-form-builder": {
+     dependencies: {
+       services: [
```

## Fix SCSS imports

```diff
- @import "ember-caluma";
+ @import "@projectcaluma/ember-form";
+ @import "@projectcaluma/ember-form-builder";
```

## Update all imports of ember-caluma

Queries:

```diff
- import { allWorkItems } from "ember-caluma/caluma-query/queries";
+ import { allWorkItems } from "@projectcaluma/ember-core/caluma-query/queries";
```

Helpers:

```diff
- import { decodeId } from "ember-caluma/helpers/decode-id";
+ import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
```

Form rendering model layer:

```diff
- import Document from "ember-caluma/lib/document";
+ import Document from "@projectcaluma/ember-form/lib/document";
```

Apollo service mixin:

```diff
- import CalumaApolloServiceMixin from "ember-caluma/mixins/caluma-apollo-service-mixin";
+ import CalumaApolloServiceMixin from "@projectcaluma/ember-core/mixins/caluma-apollo-service-mixin";
```

Mirage GraphQL:

```diff
- import graphqlHandler from "ember-caluma/mirage-graphql";
+ import graphqlHandler from "@projectcaluma/ember-testing/mirage-graphql";
```
