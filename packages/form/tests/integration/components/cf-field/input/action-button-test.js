import { click, render, waitFor, scrollTo } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { task } from "ember-concurrency";
import { Response } from "miragejs";
import { module, test } from "qunit";
import UIkit from "uikit";

import { setupRenderingTest } from "dummy/tests/helpers";

module(
  "Integration | Component | cf-field/input/action-button",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function (assert) {
      UIkit.container = this.owner.rootElement;

      const validField = new (class {
        @tracked isValid = true;

        question = { hasFormatValidators: false };

        validate = task({ restartable: true }, async () => {
          await assert.step("validate");
        });
      })();

      const invalidField = new (class {
        @tracked isValid = true;
        @tracked hidden = false;

        get isInvalid() {
          return !this.isValid;
        }

        question = { raw: { label: "foo" }, hasFormatValidators: false };

        validate = task({ restartable: true }, async () => {
          this.isValid = false;
        });
      })();

      const question = {
        raw: {
          label: "Submit",
          infoText: "Really?",
          action: "COMPLETE",
          color: "SECONDARY",
          validateOnEnter: false,
          showValidation: false,
        },
      };

      this.field = {
        document: {
          workItemUuid: this.server.create("work-item", {
            status: "READY",
            case: this.server.create("case"),
          }).id,
          fields: [validField],
        },
        question,
      };
      this.invalidField = {
        document: {
          workItemUuid: this.server.create("work-item", {
            status: "READY",
            case: this.server.create("case"),
          }).id,
          fields: [invalidField],
        },
        question,
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

    test("renders a button for complete actions", async function (assert) {
      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);
      assert.dom("button.uk-button-secondary").hasAttribute("type", "button");

      this.field.question.raw.action = "SKIP";
      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);
      assert.dom("button.uk-button-secondary").hasAttribute("type", "button");
    });

    test("validates as configured", async function (assert) {
      await render(hbs`<CfField::Input::ActionButton @field={{this.field}} />`);

      assert.verifySteps([]);
      await click("button.uk-button-secondary");
      assert.verifySteps(["validate"]);
    });

    test("doesn't show validation errors if not configured", async function (assert) {
      await render(
        hbs`<CfField::Input::ActionButton @field={{this.invalidField}} />`,
      );
      await click("button.uk-button-secondary");

      assert.dom(".uk-alert-danger").doesNotExist();
    });

    test("shows validation errors if configured", async function (assert) {
      this.invalidField.question.raw.showValidation = true;

      await render(
        hbs`<CfField::Input::ActionButton @field={{this.invalidField}} />`,
      );
      await click("button.uk-button-secondary");

      assert
        .dom(".uk-alert-danger")
        .hasText(
          "The following questions have not yet been filled in correctly: foo",
        );
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

    test("triggers the success callback", async function (assert) {
      assert.expect(3);

      await render(hbs`<CfField::Input::ActionButton
  @field={{this.field}}
  @context={{hash actionButtonOnSuccess=this.success}}
/>`);

      await click("button.uk-button-secondary");
      await waitFor(".uk-modal.uk-open");
      await click(".uk-modal-footer button.uk-button-primary");
      assert.verifySteps(["validate", "success"]);
    });

    test("triggers the error callback", async function (assert) {
      assert.expect(3);

      await render(hbs`<CfField::Input::ActionButton
  @field={{this.field}}
  @context={{hash actionButtonOnError=this.error}}
/>`);

      this.server.post("/graphql/", () => {
        return new Response(500);
      });

      await click("button.uk-button-secondary");
      await waitFor(".uk-modal.uk-open");
      await click(".uk-modal-footer button.uk-button-primary");

      assert.verifySteps(["validate", "error"]);
    });
  },
);
