import { render, click, waitFor } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module(
  "Integration | Component | cfb-form-editor/question-usage",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    test("it renders", async function (assert) {
      this.set(
        "question",
        this.server.create("question", {
          label: "Test Label",
          slug: "test-slug",
          type: "TEXT",
        }),
      );

      this.server.createList("form", 3, { questions: [this.question] });

      await render(
        hbs`<CfbFormEditor::QuestionUsage @slug={{this.question.slug}} />`,
      );

      await waitFor("[data-test-show-question-usage-modal-link]");
      await click("[data-test-show-question-usage-modal-link]");

      assert.dom("[data-test-question-usage-modal]").isVisible();
      assert.dom("[data-test-question-form-item]").exists({ count: 3 });
    });

    test("it is hidden when no other reference to this question exists", async function (assert) {
      this.set(
        "question",
        this.server.create("question", {
          label: "Test Label",
          slug: "test-slug",
          type: "TEXT",
        }),
      );

      this.server.create("form", { questions: [this.question] });

      await render(
        hbs`<CfbFormEditor::QuestionUsage @slug={{this.question.slug}} />`,
      );

      assert.dom("[data-test-show-question-usage-modal-link]").isNotVisible();
    });
  },
);
