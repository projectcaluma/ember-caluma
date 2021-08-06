import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | work-item-button", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);
  setupMirage(hooks);

  test("it renders default", async function (assert) {
    await render(
      hbs`<WorkItemButton @mutation="complete" @workItemId="test" />`
    );

    assert.dom("button").hasText("t:caluma.mutate-work-item.complete:()");
  });

  test("it renders label", async function (assert) {
    await render(
      hbs`<WorkItemButton @mutation="complete" @workItemId="test" @label="Lorem Ipsum"/>`
    );

    assert.dom("button").hasText("Lorem Ipsum");
  });

  test("it renders block", async function (assert) {
    await render(
      hbs`<WorkItemButton @mutation="complete" @workItemId="test">Lorem Ipsum</WorkItemButton>`
    );

    assert.dom("button").hasText("Lorem Ipsum");
  });

  test("it uses the correct mutation", async function (assert) {
    assert.expect(3);

    let mutation = "complete";
    this.set("mutation", mutation);

    this.server.post(
      "graphql",
      (_, request) => {
        assert.ok(
          request.requestBody.includes(
            `${mutation.charAt(0).toUpperCase() + mutation.slice(1)}WorkItem`
          )
        );

        return { data: { [`${mutation}WorkItem`]: null } };
      },
      200
    );

    await render(
      hbs`<WorkItemButton @mutation={{this.mutation}} @workItemId="test" />`
    );

    await click("button");

    mutation = "skip";
    this.set("mutation", mutation);
    await click("button");

    mutation = "cancel";
    this.set("mutation", mutation);
    await click("button");
  });

  test("it triggers willMutate hook", async function (assert) {
    assert.expect(2);

    this.willMutate = () => {
      assert.step("willMutate");
      return false;
    };

    await render(
      hbs`<WorkItemButton @mutation="complete" @workItemId="test" @willMutate={{this.willMutate}} />`
    );

    await click("button");

    assert.verifySteps(["willMutate"]);
  });
});
