# Validation

Built in components to validate Caluma documents.

## Usage

### DocumentValidity

This component yields a boolean `isValid` and a function `validate` which
validates the passed Caluma document when triggered.

```hbs
<DocumentValidity @document={{this.calumaDocument}} as |isValid validate|>
  {{#if isValid}}
    <p>The document is valid</p>
  {{/if}}
  <button {{on "click" validate}}>Validate!</button>
</DocumentValidity>
```

It can also be triggered automatically when the component enters the viewport
using the parameter `validateOnEnter`:

```hbs
<DocumentValidity
  @document={{this.calumaDocument}}
  @validateOnEnter={{true}}
  as |isValid|
>
  {{#if isValid}}
    <p>The document is valid</p>
  {{/if}}
</DocumentValidity>
```

The DocumentValidity component has two parameter:

- `document` The caluma document to be validated.
- `validateOnEnter` Whether the validate action should be triggered on entering the viewport.

The component yields `isValid` which represents the validity of all the
questions in the document and an action `validate` to trigger the validation
manually.
