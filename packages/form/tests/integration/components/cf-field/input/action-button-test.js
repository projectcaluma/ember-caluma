import { click, render, waitFor, scrollTo } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { restartableTask } from "ember-concurrency";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";
import UIkit from "uikit";

import { setupRenderingTest } from "dummy/tests/helpers";

module(
  "Integration | Component | cf-field/input/action-button",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function (assert) {
      UIkit.container = this.owner.rootElement;

      const validField = new (class {
        @tracked isValid = true;

        @restartableTask
        *validate() {
          yield assert.step("validate");
        }
      })();

      const invalidField = new (class {
        @tracked isValid = true;
        @tracked hidden = false;

        get isInvalid() {
          return !this.isValid;
        }

        question = { raw: { label: "foo" } };

        @restartableTask
        validate() {
          this.isValid = false;
        }
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
            case: this.server.create("case"),
          }).id,
          fields: [validField],
        },
        question,
      };
      this.invalidField = {
        document: {
          workItemUuid: this.server.create("work-item", {
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
        .hasText("t:caluma.form.validation.error:() foo");
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

      await render(hbs`<CfField::Input::ActionButton
  @field={{this.field}}
  @context={{hash
    actionButtonOnSuccess=this.success
    actionButtonOnError=this.error
  }}
/>`);

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
  },
);
