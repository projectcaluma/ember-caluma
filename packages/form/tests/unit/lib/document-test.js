import { module, skip, test } from "qunit";

import {
  completeWorkflowFormWorkItemUuid,
  directWorkItemUuid,
  rawDocumentWithCase,
  rawDocumentWithWorkItem,
  rawUnlinkedDocument,
} from "./data";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";
import { setupTest } from "dummy/tests/helpers";

module("Unit | Library | document", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function () {
    const Document = this.owner.factoryFor("caluma-model:document").class;

    this.buildDocument = (raw) =>
      new Document({
        raw: parseDocument(raw),
        owner: this.owner,
      });

    this.document = this.buildDocument(rawDocumentWithWorkItem);

    this.setFieldValue = async (slug, value) => {
      this.document.findField(slug).answer.value = value;
    };

    this.getDocumentHiddenState = () =>
      this.document.fields.map((field) => [field.question.slug, field.hidden]);
  });

  hooks.afterEach(async function () {
    await this.setFieldValue("question-1", null);
    await this.setFieldValue("question-2", null);
    await this.setFieldValue("question-3", null);
  });

  test("it initializes the fields hidden state correctly", async function (assert) {
    assert.expect(1);

    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", true],
      ["question-3", true],
      ["float", false],
      ["calculated", false],
      ["table", false],
      ["multiple-choice", false],
      ["json-dependency", true],
      ["choice", false],
    ]);
  });

  test("it recomputes hidden on value change of dependency", async function (assert) {
    assert.expect(1);

    await this.setFieldValue("question-1", "show-question-2");
    await this.setFieldValue("question-2", "foo");

    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", true],
      ["float", false],
      ["calculated", false],
      ["table", false],
      ["multiple-choice", false],
      ["json-dependency", true],
      ["choice", false],
    ]);
  });

  test("it recomputes hidden on hidden change of dependency", async function (assert) {
    assert.expect(2);
    await this.setFieldValue("question-1", "show-question-2");
    await this.setFieldValue("question-2", "show-question-3");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", false],
      ["float", false],
      ["calculated", false],
      ["table", false],
      ["multiple-choice", false],
      ["json-dependency", true],
      ["choice", false],
    ]);
    await this.setFieldValue("question-1", "foo");

    // since question 2 is hidden, it's value is not considered in question 3's jexl.
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", true],
      ["question-3", true],
      ["float", false],
      ["calculated", false],
      ["table", false],
      ["multiple-choice", false],
      ["json-dependency", true],
      ["choice", false],
    ]);
  });

  test("question jexl intersects operator", async function (assert) {
    assert.expect(8);

    const tests = [
      ["[1,2] intersects [2,3]", true],
      ["[1,2] intersects [3,4]", false],
      ["[] intersects []", false],
      ["[1] intersects []", false],
      ["['foo'] intersects ['bar', 'bazz']", false],
      ["['foo'] intersects ['foo', 'foo']", true],
      ["[1] intersects [1] && [2] intersects [2]", true],
      ["[2] intersects [1] + [2]", true],
    ];

    await Promise.all(
      tests.map(async ([expression, result]) => {
        assert.strictEqual(await this.document.jexl.eval(expression), result);
      }),
    );
  });

  test("question jexl mapby transform", async function (assert) {
    assert.expect(5);

    const tests = [
      [[{ foo: "bar" }, { foo: "baz" }], "value|mapby('foo')", ["bar", "baz"]],
      [
        [{ foo: "bar" }, { xy: "baz" }],
        "value|mapby('foo')",
        ["bar", undefined],
      ],
      [null, "value|mapby('foo')", null],
      ["astring", "value|mapby('foo')", null],
      [{ foo: "bar" }, "value|mapby('foo')", null],
    ];

    await Promise.all(
      tests.map(async ([value, expression, result]) => {
        assert.deepEqual(
          await this.document.jexl.eval(expression, { value }),
          result,
        );
      }),
    );
  });

  test("it transforms correcty with Math.min", async function (assert) {
    const values = [10, 20, "notANumber", 30, null, undefined, true, {}];
    const expression = "values|min";

    assert.strictEqual(
      await this.document.jexl.eval(expression, { values }),
      10,
    );
  });

  test("it transforms correcty with Math.max", async function (assert) {
    const values = [10, 20, "notANumber", 30, null, undefined, true, {}];
    const expression = "values|max";

    assert.strictEqual(
      await this.document.jexl.eval(expression, { values }),
      30,
    );
  });

  test("it transforms correcty with Math.ceil", async function (assert) {
    const value = 1.8;
    const expression = "value|ceil";

    assert.strictEqual(await this.document.jexl.eval(expression, { value }), 2);
    assert.strictEqual(
      await this.document.jexl.eval(expression, { value: null }),
      null,
    );
  });

  test("it transforms correcty with Math.floor", async function (assert) {
    const value = 1.8;
    const expression = "value|floor";

    assert.strictEqual(await this.document.jexl.eval(expression, { value }), 1);
    assert.strictEqual(
      await this.document.jexl.eval(expression, { value: null }),
      null,
    );
  });

  test("it transforms correcty with Math.round", async function (assert) {
    const value = 1.87654;
    const places = 3;
    const expression = "value|round(places)";
    const expressionWithoutPlaces = "value|round";

    assert.strictEqual(
      await this.document.jexl.eval(expression, { value, places }),
      1.877,
    );
    assert.strictEqual(
      await this.document.jexl.eval(expressionWithoutPlaces, { value, places }),
      2,
    );
    assert.strictEqual(
      await this.document.jexl.eval(expression, { value: null, places: null }),
      null,
    );
  });

  test("it transforms correcty with sum transform", async function (assert) {
    const values = [10, 20, "notANumber", 30, null, undefined, true, {}];
    const expression = "values|sum";

    assert.strictEqual(
      await this.document.jexl.eval(expression, { values }),
      60,
    );
  });

  test("it transforms correcty with avg transform", async function (assert) {
    const values = [10, 20, "notANumber", 30, null, undefined, true, {}];
    const expression = "values|avg";

    assert.strictEqual(
      await this.document.jexl.eval(expression, { values }),
      20,
    );
    assert.strictEqual(
      await this.document.jexl.eval(expression, { values: [] }),
      null,
    );
    assert.strictEqual(
      await this.document.jexl.eval(expression, { values: [10] }),
      10,
    );
  });

  test("it transforms correcty with stringify transform", async function (assert) {
    assert.true(
      await this.document.jexl.eval(
        '\'["test1","test2"]\' == value|stringify',
        {
          value: ["test1", "test2"],
        },
      ),
    );
  });

  test("it transforms correcty with flatten transform", async function (assert) {
    const expression = "array|flatten";

    assert.deepEqual(
      await this.document.jexl.eval(expression, {
        array: [["some-value"], ["some-other-value"]],
      }),
      ["some-value", "some-other-value"],
    );
    assert.strictEqual(
      await this.document.jexl.eval(expression, { array: null }),
      null,
    );
  });

  test.each(
    "it transforms correcty with count transform",
    [
      ["['test1', 'test2']|length", 2],
      ["{key: 1}|length", 1],
      ["'foobar'|length", 6],
      ["1|length", null],
      ["1.1|length", null],
      ["null|length", null],
    ],
    async function (assert, [expression, expected]) {
      assert.strictEqual(
        await this.document.jexl.eval(expression),
        expected,
        `Expected expression "${expression}" to evaluate to "${expected}"`,
      );
    },
  );

  test("computes the correct jexl context (task form)", async function (assert) {
    assert.expect(1);

    assert.deepEqual(this.document.jexlContext, {
      null: null,
      form: "form",
      info: {
        case: {
          form: "child-case-form",
          meta: { "is-main-case": false },
          root: {
            form: "root-case-form",
            workflow: "root-case-workflow",
            meta: { "is-main-case": true },
          },
          workflow: "child-case-workflow",
        },
        workItem: {
          meta: { "notify-on-completion": true },
          task: "some-task",
        },
        root: { form: "form", formMeta: { "is-top-form": true, level: 0 } },
      },
    });
  });

  test("computes the correct jexl context (case form)", async function (assert) {
    assert.expect(1);

    assert.deepEqual(this.buildDocument(rawDocumentWithCase).jexlContext, {
      null: null,
      form: "form",
      info: {
        case: {
          form: "child-case-form",
          meta: { "is-main-case": false },
          root: {
            form: "root-case-form",
            workflow: "root-case-workflow",
            meta: { "is-main-case": true },
          },
          workflow: "child-case-workflow",
        },
        workItem: null,
        root: { form: "form", formMeta: { "is-top-form": true, level: 0 } },
      },
    });
  });

  test("computes the correct jexl context (unlinked document)", async function (assert) {
    assert.expect(1);

    assert.deepEqual(this.buildDocument(rawUnlinkedDocument).jexlContext, {
      null: null,
      form: "form",
      info: {
        case: null,
        workItem: null,
        root: { form: "form", formMeta: { "is-top-form": true, level: 0 } },
      },
    });
  });

  test("resolves the work item it is attached to", async function (assert) {
    assert.expect(3);

    // Directly attached via a CompleteTaskFormTask work item
    assert.strictEqual(
      this.document.workItemUuid,
      decodeId(directWorkItemUuid),
      "takes the document's own work item",
    );

    // Indirectly attached - the case document belongs to the case's
    // CompleteWorkflowFormTask work item
    assert.strictEqual(
      this.buildDocument(rawDocumentWithCase).workItemUuid,
      decodeId(completeWorkflowFormWorkItemUuid),
      "falls back to the case's complete workflow form work item",
    );

    assert.strictEqual(
      this.buildDocument(rawUnlinkedDocument).workItemUuid,
      null,
      "is null without a case or work item",
    );
  });

  skip("it recomputes hidden on hidden change of parent fieldset", async function () {});
  skip("it recomputes optional on hidden change of parent fieldset", async function () {});
  skip("it recomputes optional on hidden change of dependency", async function () {});
});
