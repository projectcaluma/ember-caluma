import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field/input/powerselect", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders (single)", async function(assert) {
    assert.expect(1);

    this.set("field", {
      id: "test",
      answer: {
        _valueKey: "stringValue",
        stringValue: "option-3"
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

    await render(hbs`{{cf-field/input/powerselect field=field }}`);

    assert.dom(".ember-power-select-trigger").exists();
  });

  test("it saves on click (single)", async function(assert) {
    assert.expect(3);

    this.set("field", {
      id: "test",
      answer: {
        _valueKey: "stringValue",
        stringValue: "option-3"
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

    this.set("onSave", choice => {
      this.set("field.answer.stringValue", choice);
    });

    await render(
      hbs`{{cf-field/input/powerselect field=field onSave=onSave }}`
    );

    assert.dom(".ember-power-select-trigger").exists();
    await click(".ember-power-select-trigger");

    assert.dom(".ember-power-select-option").exists({ count: 3 });
    await click(".ember-power-select-option:first-child");

    assert.equal(this.field.answer.stringValue, "option-1");
  });

  test("it renders (multiple)", async function(assert) {
    assert.expect(1);

    this.set("field", {
      id: "test",
      answer: {
        _valueKey: "listValue",
        listValue: ["option-1", "option-2"]
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

    await render(hbs`{{cf-field/input/powerselect field=field }}`);

    assert.dom(".ember-power-select-trigger").exists();
  });

  test("it saves on click (multiple)", async function(assert) {
    assert.expect(3);

    this.set("field", {
      id: "test",
      answer: {
        _valueKey: "listValue",
        listValue: ["option-1", "option-2"]
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

    this.set("onSave", choices => {
      this.set("field.answer.listValue", choices);
    });

    await render(
      hbs`{{cf-field/input/powerselect field=field onSave=onSave }}`
    );

    assert.dom(".ember-power-select-trigger").exists();
    await click(".ember-power-select-trigger");

    assert.dom(".ember-power-select-option").exists({ count: 3 });
    await click(".ember-power-select-option:first-child");

    assert.deepEqual(this.field.answer.listValue, ["option-2"]);
  });
});
