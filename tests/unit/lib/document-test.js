import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Document from "ember-caluma/lib/document";
import { settled } from "@ember/test-helpers";
import nestedRaw from "./nested";

module("Unit | Library | document", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function() {
    this.set("setFieldValue", async (slug, value) => {
      this.document.fields
        .find(field => field.question.slug === slug)
        .set("answer.value", value);
      await settled();
    });
    this.set("getDocumentHiddenState", () =>
      this.document.fields.map(field => [
        field.question.slug,
        field.question.hidden
      ])
    );

    const raw = {
      id: 1,
      answers: {
        edges: []
      },
      form: {
        questions: {
          edges: [
            {
              node: {
                slug: "question-1",
                label: "Question 1",
                isRequired: "false",
                isHidden: "false",
                __typename: "TextQuestion"
              }
            },
            {
              node: {
                slug: "question-2",
                label: "Question 2",
                isRequired: "false",
                isHidden: "'question-1'|answer == 'magic'",
                __typename: "TextQuestion"
              }
            },
            {
              node: {
                slug: "question-3",
                label: "Question 3",
                isRequired: "false",
                isHidden: "'question-2'|answer == 'Harry Potter'",
                __typename: "TextQuestion"
              }
            }
          ]
        }
      }
    };

    this.set("document", Document.create(this.owner.ownerInjection(), { raw }));
    this.set(
      "nestedDocument",
      Document.create(this.owner.ownerInjection(), { raw: nestedRaw })
    );
    await settled();
  });
  hooks.afterEach(async function() {
    await this.setFieldValue("question-1", null);
    await this.setFieldValue("question-2", null);
  });

  test("it initializes isHidden correctly", async function(assert) {
    assert.expect(1);
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", true],
      ["question-3", true]
    ]);
  });

  test("it recomputes isHidden on value change of dependency", async function(assert) {
    assert.expect(1);
    await this.setFieldValue("question-1", "foo");
    await this.setFieldValue("question-2", "Harry Potter");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", true]
    ]);
  });

  test("it recomputes isHidden on isHidden change of dependency", async function(assert) {
    assert.expect(3);
    await this.setFieldValue("question-1", "foo");
    await this.setFieldValue("question-2", "bar");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", false]
    ]);
    await this.setFieldValue("question-1", "magic");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", true],
      ["question-3", true]
    ]);
    await this.setFieldValue("question-1", "foo");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", false]
    ]);
  });

  test("can do cross-form path traversal", async function(assert) {
    // get random leaf document
    const grandChildDoc = this.nestedDocument.childDocuments[0]
      .childDocuments[1];
    assert.deepEqual(
      grandChildDoc.findField("parent.parent.b.b-a.b-a-1").answer.value,
      "foobar"
    );
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
      assert.equal(await this.document.questionJexl.eval(expression), result);
    }
  });
});
