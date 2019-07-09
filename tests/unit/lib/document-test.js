import { module, test, skip } from "qunit";
import { setupTest } from "ember-qunit";
import Document from "ember-caluma/lib/document";
import { settled } from "@ember/test-helpers";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";

module("Unit | Library | document", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function() {
    this.owner.register("service:validator", ValidatorServiceStub);

    this.set("setFieldValue", async (slug, value) => {
      this.document.findField(slug).set("answer.value", value);

      await settled();
    });

    this.set("getDocumentHiddenState", () =>
      this.document.fields.map(field => [field.question.slug, field.hidden])
    );

    const form = {
      __typename: "Form",
      slug: "some-form",
      questions: [
        {
          slug: "question-1",
          label: "Question 1",
          isRequired: "false",
          isHidden: "false",
          __typename: "TextQuestion"
        },
        {
          slug: "question-2",
          label: "Question 2",
          isRequired: "false",
          isHidden: "!('question-1'|answer == 'show-question-2')",
          __typename: "TextQuestion"
        },
        {
          slug: "question-3",
          label: "Question 3",
          isRequired: "false",
          isHidden:
            "!('question-1'|answer == 'show-question-3' || 'question-2'|answer == 'show-question-3')",
          __typename: "TextQuestion"
        }
      ]
    };

    const raw = {
      id: 1,
      __typename: "Document",
      answers: [],
      rootForm: form,
      forms: [form]
    };

    this.set("document", Document.create(this.owner.ownerInjection(), { raw }));

    await settled();
  });

  hooks.afterEach(async function() {
    await this.setFieldValue("question-1", null);
    await this.setFieldValue("question-2", null);
    await this.setFieldValue("question-3", null);
  });

  test("it initializes the fields hidden state correctly", async function(assert) {
    assert.expect(1);

    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", true],
      ["question-3", true]
    ]);
  });

  test("it recomputes hidden on value change of dependency", async function(assert) {
    assert.expect(1);

    await this.setFieldValue("question-1", "show-question-2");
    await this.setFieldValue("question-2", "foo");

    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", true]
    ]);
  });

  test("it recomputes hidden on hidden change of dependency", async function(assert) {
    assert.expect(2);
    await this.setFieldValue("question-1", "show-question-2");
    await this.setFieldValue("question-2", "show-question-3");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", false]
    ]);
    await this.setFieldValue("question-1", "foo");

    // since question 2 is hidden, it's value is not considered in question 3's jexl.
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", true],
      ["question-3", true]
    ]);
  });

  test("question jexl intersects operator", async function(assert) {
    const tests = [
      ["[1,2] intersects [2,3]", true],
      ["[1,2] intersects [3,4]", false],
      ["[] intersects []", false],
      ["[1] intersects []", false],
      ["['foo'] intersects ['bar', 'bazz']", false],
      ["['foo'] intersects ['foo', 'foo']", true],
      ["[1] intersects [1] && [2] intersects [2]", true],
      ["[2] intersects [1] + [2]", true]
    ];
    for (let [expression, result] of tests) {
      assert.equal(await this.document.jexl.eval(expression), result);
    }
  });

  test("question jexl mapby transform", async function(assert) {
    const tests = [
      [[{ foo: "bar" }, { foo: "baz" }], "value|mapby('foo')", ["bar", "baz"]],
      [
        [{ foo: "bar" }, { xy: "baz" }],
        "value|mapby('foo')",
        ["bar", undefined]
      ],
      [null, "value|mapby('foo')", null],
      ["astring", "value|mapby('foo')", null],
      [{ foo: "bar" }, "value|mapby('foo')", null]
    ];
    for (let [value, expression, result] of tests) {
      assert.deepEqual(
        await this.document.jexl.eval(expression, { value }),
        result
      );
    }
  });

  test("computes the correct jexl context", async function(assert) {
    assert.expect(1);

    assert.deepEqual(this.document.jexlContext, { form: "some-form" });
  });

  skip("it recomputes hidden on hidden change of parent fieldset", async function() {});
  skip("it recomputes optional on hidden change of parent fieldset", async function() {});
  skip("it recomputes optional on hidden change of dependency", async function() {});
});
