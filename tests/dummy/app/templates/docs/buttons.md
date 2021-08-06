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
- `willMutate`(Optional) Function to be called before the mutation is executed, if this function returns `false` the mutation is aborted.

Additionally there are many optional parameters for the underlying [UkButton](https://adfinis-sygroup.github.io/ember-uikit/#/docs/components/button) component, refer to the UkButton component documentation to see what exactly they do:

- `type`
- `disabled`
- `loading`
- `color`
- `size`
- `title`

### TaskButton

TaskButton uses the WorkItemButton as the foundation. Instead of passing a work item id, it taskes a task slug and graphql filters for the allWorkItems query and fetches the work item to be mutated.

```hbs
<TaskButton
  @label="Lorem Ipsum"
  @mutation="complete"
  @task="some-task"
  @filters="(array"
  (hash
  myFilter="test"
  ))
/>

<TaskButton
  @mutation="complete"
  @task="some-task"
  @filters="(array"
  (hash
  myFilter="test"
  ))
>
  Lorem Ipsum
</TaskButton>
```

The TaskButton component has 6 parameters:

- `mutation` The state mutation to be used either `complete`, `skip` or `cancel`.
- `task` Slug of the task.
- `filters` (Optional) Filters of the allWorkItems query.
- `label` (Optional) Overwrites the button text.
- `onSuccess`(Optional) Will be passed to WorkItemButton onSuccess.
- `onError`(Optional) Will be passed to WorkItemButton onError.
- `willMutate`(Optional) Will be passed to WorkItemButton willMutate.

Additionally the [UkButton](https://adfinis-sygroup.github.io/ember-uikit/#/docs/components/button) parameters from the WorkItemButton still apply.
