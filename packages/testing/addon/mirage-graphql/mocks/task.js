import { classify } from "@ember/string";

import { register } from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

export default class extends BaseMock {
  @register("Task")
  handleTask(root, vars, ...args) {
    const serialized = this.handle.fn.call(this, root, vars);

    let taskId =
      root.taskId || (root.node && root.node(root, vars, ...args).id);

    try {
      taskId = atob(taskId).split(":")[1];
    } catch (e) {
      // pass
    }

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
  handleSimpleTask(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("CompleteWorkflowFormTask")
  handleCompleteWorkflowForm(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("CompleteTaskFormTask")
  handleCompleteTaskForm(...args) {
    return this.handleInterfaceType(...args);
  }
}
