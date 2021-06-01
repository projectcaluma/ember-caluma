# Buttons

`ember-caluma` provides buttons for mutating the state of work items.

## Usage

### WorkItemButton

The text of the button is per default the mutation name, it can be overwritten with either the `label` parameter or using the component in block form.

```hbs
<WorkItemButton
  @mutation="complete"
  @workItemId="bb94ad56-d650-4c21-ba51-7c4230aef4b8"
/>

<WorkItemButton
  @label="Lorem Ipsum"
  @mutation="complete"
  @workItemId="bb94ad56-d650-4c21-ba51-7c4230aef4b8"
/>

<WorkItemButton
  @mutation="complete"
  @workItemId="bb94ad56-d650-4c21-ba51-7c4230aef4b8"
>
  Lorem Ipsum
</WorkItemButton>
```

The WorkItemButton component has 5 parameters:

- `mutation` The state mutation to be used either `complete`, `skip` or `cancel`.
- `workItemId` Id of the work item which should be mutated.
- `label` (Optional) Overwrites the button text.
- `onSuccess`(Optional) Function to be called when the mutation succeeds.
- `onError`(Optional) Function to be called when the mutation fails.

Additionally there are many optional parameters for the underlying [UkButton](https://adfinis-sygroup.github.io/ember-uikit/#/docs/components/button) component, refer to the UkButton component documentation to see what exactly they do:

- `type`
- `disabled`
- `loading`
- `color`
- `size`
- `title`
