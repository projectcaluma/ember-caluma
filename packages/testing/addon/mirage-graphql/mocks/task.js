import { register } from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

export default class extends BaseMock {
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
