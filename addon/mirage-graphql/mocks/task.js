import BaseMock from "ember-caluma-form-builder/mirage-graphql/mocks/base";
import { register } from "ember-caluma-form-builder/mirage-graphql";
import { classify } from "@ember/string";
import { atob } from "ember-caluma-form-builder/helpers/atob";

export default class extends BaseMock {
  @register("Task")
  handleTask(root, vars) {
    const serialized = this.handle.fn.call(this, root, vars);

    let taskId = atob(root.taskId || (root.node && root.node(...arguments).id));
    let __typename = root.__typename;

    if (taskId) {
      __typename = `${classify(
        this.collection.findBy({ id: taskId }).type.toLowerCase()
      )}Task`;
    }

    return { ...serialized, __typename };
  }

  handleInterfaceType(root, vars, _, meta) {
    return this.handle.fn.call(
      this,
      root,
      { ...vars, id: root.taskId },
      _,
      meta
    );
  }

  @register("SimpleTask")
  handleSimpleTask() {
    return this.handleInterfaceType(...arguments);
  }

  @register("CompleteWorkflowFormTask")
  handleCompleteWorkflowForm() {
    return this.handleInterfaceType(...arguments);
  }

  @register("CompleteTaskFormTask")
  handleCompleteTaskForm() {
    return this.handleInterfaceType(...arguments);
  }
}
