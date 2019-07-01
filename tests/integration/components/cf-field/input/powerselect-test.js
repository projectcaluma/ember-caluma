import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field/input/powerselect", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set("singleChoiceField", {
      id: "test-single",
      answer: {
        value: null,
        __typename: "StringAnswer"
      },
      question: {
        __typename: "ChoiceQuestion",
        choiceOptions: {
          edges: [
            { node: { slug: "option-1", label: "Option 1" } },
            { node: { slug: "option-2", label: "Option 2" } },
            { node: { slug: "option-3", label: "Option 3" } }
          ]
        }
      }
    });

    this.set("multipleChoiceField", {
      id: "test-multiple",
      answer: {
        value: null,
        __typename: "ListAnswer"
      },
      question: {
        __typename: "MultipleChoiceQuestion",
        multipleChoiceOptions: {
          edges: [
            { node: { slug: "option-1", label: "Option 1" } },
            { node: { slug: "option-2", label: "Option 2" } },
            { node: { slug: "option-3", label: "Option 3" } }
          ]
        }
      }
    });
  });

  test("it renders (single)", async function(assert) {
    assert.expect(1);

    await render(
      hbs`{{cf-field/input/powerselect
        field=singleChoiceField
      }}`
    );

    assert.dom(".ember-power-select-trigger").exists();
  });

  test("it saves on click (single)", async function(assert) {
    assert.expect(3);

    this.set("onSave", choice => {
      this.set("singleChoiceField.answer.value", choice);
    });

    await render(
      hbs`{{cf-field/input/powerselect
        field=singleChoiceField
        onSave=onSave
      }}`
    );

    assert.dom(".ember-power-select-trigger").exists();
    await click(".ember-power-select-trigger");

    assert.dom(".ember-power-select-option").exists({ count: 3 });
    await click(".ember-power-select-option:first-child");

    assert.equal(this.singleChoiceField.answer.value, "option-1");
  });

  test("it renders (multiple)", async function(assert) {
    assert.expect(1);

    await render(
      hbs`{{cf-field/input/powerselect
        field=multipleChoiceField
      }}`
    );

    assert.dom(".ember-power-select-trigger").exists();
  });

  test("it saves on click (multiple)", async function(assert) {
    assert.expect(3);

    this.set("onSave", choices => {
      this.set("multipleChoiceField.answer.value", choices);
    });

    await render(
      hbs`{{cf-field/input/powerselect
        field=multipleChoiceField
        onSave=onSave
      }}`
    );

    // Check if select is being rendered.
    assert.dom(".ember-power-select-trigger").exists();
    // Open the dropdown menu.
    await click(".ember-power-select-trigger");
    // Check if dropdown content is being rendered.
    assert.dom(".ember-power-select-option").exists({ count: 3 });
    // Click first item from dropdown.
    await click(".ember-power-select-option:nth-child(1)");
    // Reopen dropdown menu.
    await click(".ember-power-select-trigger");
    // Select second item from dropdown .
    await click(".ember-power-select-option:nth-child(2)");

    assert.deepEqual(this.multipleChoiceField.answer.value, [
      "option-1",
      "option-2"
    ]);
  });

  test("it handles empty selections (multiple)", async function(assert) {
    assert.expect(3);

    this.set("onSave", choices => {
      this.set("multipleChoiceField.answer.value", choices);
    });

    await render(
      hbs`{{cf-field/input/powerselect
        field=multipleChoiceField
        onSave=onSave
      }}`
    );

    this.set("multipleChoiceField.answer.value", ["option-1"]);

    assert.dom(".ember-power-select-trigger").exists();
    await click(".ember-power-select-trigger");
    assert.dom(".ember-power-select-option[aria-selected='true']").exists();
    await click(".ember-power-select-option[aria-selected='true']");

    assert.deepEqual(this.multipleChoiceField.answer.value, []);
  });
});
