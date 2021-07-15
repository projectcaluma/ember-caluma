# Validation

Built in components to validate Caluma data.

## Usage

### DocumentValidity

By passing a document to this component checks the validity of all its questions.
The document will only be validated after the component enters the viewport.

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
