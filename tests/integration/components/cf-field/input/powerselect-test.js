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

    this.set("multipleChoiceField", {
      id: "test-multiple",
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
      this.set("singleChoiceField.answer.stringValue", choice);
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

    assert.equal(this.singleChoiceField.answer.stringValue, "option-1");
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
      this.set("multipleChoiceField.answer.listValue", choices);
    });

    await render(
      hbs`{{cf-field/input/powerselect 
        field=multipleChoiceField 
        onSave=onSave 
      }}`
    );

    assert.dom(".ember-power-select-trigger").exists();
    await click(".ember-power-select-trigger");

    assert.dom(".ember-power-select-option").exists({ count: 3 });
    await click(".ember-power-select-option:first-child");

    assert.deepEqual(this.multipleChoiceField.answer.listValue, ["option-2"]);
  });
});
