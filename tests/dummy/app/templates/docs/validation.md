# Validation

Built in components to validate Caluma data.

## Usage

### DocumentValidity

This component validates the passed document for its validity as soon as it enters the viewport and will yield the validity status of the document.

```hbs
<DocumentValidity @document={{this.calumaDocument}} as |isValid|>
  {{#if isValid}}
    <p>The document is valid</p>
  {{/if}}
</DocumentValidity>
```

The DocumentValidity component has one parameter:

- `document` The document to be validated.

The component yields `isValid` which represents the validity of all the questions in the document.
