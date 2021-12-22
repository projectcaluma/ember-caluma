import { click, render, waitFor, scrollTo } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { restartableTask } from "ember-concurrency-decorators";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import UIkit from "uikit";

module(
  "Integration | Component | cf-field/input/action-button",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function (assert) {
      UIkit.container = this.owner.rootElement;

      this.field = {
        document: {
          workItemUuid: this.server.create("work-item").id,
          fields: [
            new (class {
              @tracked isValid = true;

              @restartableTask
              *validate() {
                yield assert.step("validate");
              }
            })(),
          ],
        },
        question: {
          raw: {
            label: "Submit",
            infoText: "Really?",
            action: "COMPLETE",
            color: "SECONDARY",
            validateOnEnter: false,
          },
        },
      };

      this.success = function () {
        assert.step("success");
      };
      this.error = function () {
        assert.step("error");
      };
    });

    test("renders a button", async function (assert) {
      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);

      assert.dom("button.uk-button-secondary").exists();
    });

    test("renders a submit button for complete actions", async function (assert) {
      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);
      assert.dom("button.uk-button-secondary").hasAttribute("type", "submit");

      this.field.question.raw.action = "SKIP";
      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);
      assert.dom("button.uk-button-secondary").hasAttribute("type", "button");
    });

    test("validates as configured", async function (assert) {
      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);

      assert.verifySteps([]);
      await click("button.uk-button-secondary");
      assert.verifySteps(["validate"]);

      this.field.question.raw.validateOnEnter = true;

      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);

      // wait for the button to enter the viewport which triggers the validation
      await scrollTo("button", 0, 0);
      await waitFor("button:enabled");

      assert.verifySteps(["validate"]);
    });

    test("does not validate if action is skip", async function (assert) {
      this.field.question.raw.action = "skip";

      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);

      assert.verifySteps([]);
      await click("button.uk-button-secondary");
      assert.verifySteps([]);

      this.field.question.raw.validateOnEnter = true;

      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);

      // wait for the button to enter the viewport which triggers the validation
      await scrollTo("button", 0, 0);
      await waitFor("button:enabled");

      assert.verifySteps([]);
    });

    test("triggers the callback functions", async function (assert) {
      assert.expect(6);

      await render(hbs`
      <CfField::Input::ActionButton
        @field={{this.field}}
        @context={{hash
          actionButtonOnSuccess=this.success
          actionButtonOnError=this.error
        }}
      />
    `);

      await click("button.uk-button-secondary");
      await waitFor(".uk-modal.uk-open");
      await click(".uk-modal-footer button.uk-button-primary");
      assert.verifySteps(["validate", "success"]);

      this.server.post("/graphql/", {}, 500);

      await click("button.uk-button-secondary");
      await waitFor(".uk-modal.uk-open");
      await click(".uk-modal-footer button.uk-button-primary");

      assert.verifySteps(["validate", "error"]);
    });
  }
);
