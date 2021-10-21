# Helpers

`@projectcaluma/ember-core` provides various useful template helpers for using Caluma.

## decode-id

This helper converts a GraphQL ID to a **slug** or **UUID**:

<!-- prettier-ignore-start -->
<DocsDemo as |demo|>
  <demo.example @name="decode-id-example.hbs">
    {{decode-id "Q2FzZTo1MTkzNzI3ZC03Yjc5LTQxOTItYTcyZS0xMDAxYzFlNTAyM2E="}}
  </demo.example>

  <demo.snippet @name="decode-id-example.hbs" />
</DocsDemo>
<!-- prettier-ignore-end -->

## group-name

This helper is used in Caluma to determine the displayed name of a group since
those are only stored as a primitive value in the Caluma backend but are
possibly provided by an OIDC provider or some other backend. To prevent Caluma
from only displaying the primitive value in its engines and addons we allow
customizing of the group name by passing certain information in the Caluma
options service. This enables the host app to define what's displayed as a name.

Caluma also strives to cause as little requests as possible if the host app uses
an API to fetch the group data. The `group-name` helper collects all groups that
would be requested in a single render loop and batch resolves them with the
customization provided.

The resolving of the groups can be customized by configuring a `resolveGroups`
method on the options service. There are also properties on the service that
define which property of the resolved group object is used for identifying the
correct group and which property is used as display name:

- `groupIdentifierProperty`, defaults to `"id"`
- `groupIdentifierNameProperty`, defaults to `"name"`

<!-- prettier-ignore-start -->
<DocsDemo as |demo|>
  <demo.example @name="group-name-example.hbs">
    <strong>{{group-name 1}}</strong>
    work in the building as
    <strong>{{group-name 2}}</strong>
  </demo.example>

  <demo.snippet @name="group-name-example.hbs" />
  <demo.snippet
    @name="caluma-options-service-query-if-not-cached.js"
    @label="services/caluma-options.js"
  />
  <demo.snippet
    @name="caluma-options-service-groups.js"
    @label="services/caluma-options.js"
  />
</DocsDemo>
<!-- prettier-ignore-end -->

## user-name

This helper works the same as the [`group-name`](#group-name) helper but with
users instead of groups. You can customize the displayed user name in the Caluma
options service by configuring a possibly asynchronous method `resolveUsers`.

Per default `@projectcaluma/core` defines a property for identifying the user
object and a property used as a display name. Those can be customized in the
options service as well:

- `userIdentifierProperty`, defaults to `"username"`
- `userIdentifierNameProperty`, defaults to `"fullName"`

<!-- prettier-ignore-start -->
<DocsDemo as |demo|>
  <demo.example @name="user-name-example.hbs">
    <strong>{{user-name 1}}</strong>
    works in the same departement as
    <strong>{{user-name 2}}</strong>
  </demo.example>

  <demo.snippet @name="user-name-example.hbs" />
  <demo.snippet
    @name="caluma-options-service-query-if-not-cached.js"
    @label="services/caluma-options.js"
  />
  <demo.snippet
    @name="caluma-options-service-users.js"
    @label="services/caluma-options.js"
  />
</DocsDemo>
<!-- prettier-ignore-end -->
