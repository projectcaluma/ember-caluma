import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import { task } from "ember-concurrency";
import { defineProperty } from "@ember/object";

module("Integration | Component | cfb-form-editor", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    defineProperty(
      this,
      "data",
      task(function*() {
        return yield {
          id: 1,
          name: "Test Name",
          slug: "test-slug",
          questions: {
            edges: [
              {
                node: {
                  id: 1,
                  slug: "question-1",
                  type: "text",
                  label: "Question 1?"
                }
              },
              {
                node: {
                  id: 2,
                  slug: "question-2",
                  type: "text",
                  label: "Question 2?"
                }
              },
              {
                node: {
                  id: 3,
                  slug: "question-3",
                  type: "text",
                  label: "Question 3?"
                }
              },
              {
                node: {
                  id: 4,
                  slug: "question-4",
                  type: "text",
                  label: "Question 4?"
                }
              },
              {
                node: {
                  id: 5,
                  slug: "question-5",
                  type: "text",
                  label: "Question 5?"
                }
              }
            ]
          }
        };
      })
    );
  });

  test("it renders blockless", async function(assert) {
    assert.expect(2);

    await render(hbs`{{cfb-form-editor data=data slug='test-slug'}}`);

    assert.dom("h1 > span").hasText("Test Name");
    assert.dom("[data-test-question-list-item]").exists({ count: 5 });
  });

  test("it renders block style", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#cfb-form-editor data=data slug='test-slug'}}
        Content!
      {{/cfb-form-editor}}
    `);

    assert.dom("[uk-grid] > div:first-of-type").hasText("Content!");
    assert.dom("[data-test-question-list]").exists();
  });

  test("it can trigger a back action", async function(assert) {
    assert.expect(2);

    this.set("back", () => assert.step("back"));

    await render(
      hbs`{{cfb-form-editor data=data slug='test-slug' on-back=(action back)}}`
    );

    await click("[data-test-back]");

    assert.verifySteps(["back"]);
  });
});
