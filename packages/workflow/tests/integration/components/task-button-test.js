import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | task-button", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.server.post(
      "graphql",
      () => {
        return {
          data: {
            allWorkItems: {
              edges: [
                {
                  node: {
                    id: "work-item-id",
                    __typename: "WorkItem",
                  },
                  __typename: "WorkItemEdge",
                },
              ],
              __typename: "WorkItemConnection",
            },
          },
        };
      },
      200
    );
  });

  test("it renders default", async function (assert) {
    await render(hbs`<TaskButton @mutation="complete" @task="test"/>`);

    assert.dom("button").hasText("t:caluma.mutate-work-item.complete:()");
  });

  test("it renders label", async function (assert) {
    await render(
      hbs`<TaskButton @mutation="complete" @task="test" @label="Lorem Ipsum"/>`
    );

    assert.dom("button").hasText("Lorem Ipsum");
  });

  test("it renders block", async function (assert) {
    await render(
      hbs`<TaskButton @mutation="complete" @task="test">Lorem Ipsum</TaskButton>`
    );

    assert.dom("button").hasText("Lorem Ipsum");
  });
});
