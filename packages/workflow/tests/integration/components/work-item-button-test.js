import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | work-item-button", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.workItem = this.server.create("workItem", { status: "READY" });
    this.id = this.workItem.id;
  });

  test("it renders default", async function (assert) {
    await render(
      hbs`<WorkItemButton @mutation="complete" @workItemId={{this.id}} />`,
    );

    assert.dom("button").hasText("Complete");
  });

  test("it renders label", async function (assert) {
    await render(
      hbs`<WorkItemButton
  @mutation="complete"
  @workItemId={{this.id}}
  @label="Lorem Ipsum"
/>`,
    );

    assert.dom("button").hasText("Lorem Ipsum");
  });

  test("it renders block", async function (assert) {
    await render(
      hbs`<WorkItemButton @mutation="complete" @workItemId={{this.id}}>Lorem Ipsum</WorkItemButton>`,
    );

    assert.dom("button").hasText("Lorem Ipsum");
  });

  test("it uses the correct mutation", async function (assert) {
    assert.expect(3);

    let mutation = "complete";
    this.set("mutation", mutation);

    await render(
      hbs`<WorkItemButton @mutation={{this.mutation}} @workItemId={{this.id}} />`,
    );

    this.server.post(
      "graphql",
      (_, request) => {
        assert.ok(
          request.requestBody.includes(
            `${mutation.charAt(0).toUpperCase() + mutation.slice(1)}WorkItem`,
          ),
        );

        return { data: { [`${mutation}WorkItem`]: null } };
      },
      200,
    );

    await click("button");

    mutation = "skip";
    this.set("mutation", mutation);
    await click("button");

    mutation = "cancel";
    this.set("mutation", mutation);
    await click("button");
  });

  test("it triggers beforeMutate hook", async function (assert) {
    assert.expect(2);

    this.beforeMutate = () => {
      assert.step("beforeMutate");
      return false;
    };

    await render(
      hbs`<WorkItemButton
  @mutation="complete"
  @workItemId={{this.id}}
  @beforeMutate={{this.beforeMutate}}
/>`,
    );

    await click("button");

    assert.verifySteps(["beforeMutate"]);
  });

  test("it renders as disabled if the required work item status is not given", async function (assert) {
    assert.expect(2);

    await render(
      hbs`<WorkItemButton @mutation="complete" @workItemId={{this.id}} />`,
    );

    assert.dom("button").isNotDisabled();

    this.workItem.status = "COMPLETED";
    this.workItem.save();

    await render(
      hbs`<WorkItemButton @mutation="complete" @workItemId={{this.id}} />`,
    );

    assert.dom("button").isDisabled();
  });
});
