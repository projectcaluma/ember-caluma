# Validation

Built in components to validate Caluma data.

## Usage

### DocumentValidity

This component validates the passed document for its validity as soon as it
enters the viewport and will yield the validity status of the document and an
action for manual validation.

```hbs
<DocumentValidity @document={{this.calumaDocument}} as |isValid|>
  {{#if isValid}}
    <p>The document is valid</p>
  {{/if}}
</DocumentValidity>
```

Or when triggered manually:

```hbs
<DocumentValidity
  @document={{this.calumaDocument}}
  @validateOnEnter={{false}}
  as |isValid validate|
>
  {{#if isValid}}
    <p>The document is valid</p>
  {{/if}}
  <button {{on "click" validate}}>Validate!</button>
</DocumentValidity>
```

The DocumentValidity component has two parameter:

- `document` The caluma document to be validated.
- `validateOnEnter` Whether the validate action should be triggered on entering the viewport.

The component yields `isValid` which represents the validity of all the
questions in the document and an action `validate` to trigger the validation
manually.
