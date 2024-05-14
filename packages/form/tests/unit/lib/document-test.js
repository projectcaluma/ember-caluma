import { settled } from "@ember/test-helpers";
import { module, test, skip } from "qunit";

import {
  rawDocumentWithCase,
  rawDocumentWithWorkItem,
  rawUnlinkedDocument,
} from "./data";

import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";
import { setupTest } from "dummy/tests/helpers";

module("Unit | Library | document", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function () {
    this.set("setFieldValue", async (slug, value) => {
      this.document.findField(slug).answer.value = value;

      await settled();
    });

    this.set("getDocumentHiddenState", () =>
      this.document.fields.map((field) => [field.question.slug, field.hidden]),
    );

    this.set(
      "document",
      new (this.owner.factoryFor("caluma-model:document").class)({
        raw: parseDocument(rawDocumentWithWorkItem),
        owner: this.owner,
      }),
    );

    await settled();
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

  test("computes the correct jexl context (task form)", async function (assert) {
    assert.expect(1);

    assert.deepEqual(this.document.jexlContext, {
      null: null,
      form: "form",
      info: {
        case: {
          form: "child-case-form",
          root: {
            form: "root-case-form",
            workflow: "root-case-workflow",
          },
          workflow: "child-case-workflow",
        },
        root: { form: "form", formMeta: { "is-top-form": true, level: 0 } },
      },
    });
  });

  test("computes the correct jexl context (case form)", async function (assert) {
    assert.expect(1);

    const documentWithCase = new (this.owner.factoryFor(
      "caluma-model:document",
    ).class)({
      raw: parseDocument(rawDocumentWithCase),
      owner: this.owner,
    });
    assert.deepEqual(documentWithCase.jexlContext, {
      null: null,
      form: "form",
      info: {
        case: {
          form: "child-case-form",
          root: {
            form: "root-case-form",
            workflow: "root-case-workflow",
          },
          workflow: "child-case-workflow",
        },
        root: { form: "form", formMeta: { "is-top-form": true, level: 0 } },
      },
    });
  });

  test("computes the correct jexl context (unlinked document)", async function (assert) {
    assert.expect(1);

    const documentWithCase = new (this.owner.factoryFor(
      "caluma-model:document",
    ).class)({
      raw: parseDocument(rawUnlinkedDocument),
      owner: this.owner,
    });
    assert.deepEqual(documentWithCase.jexlContext, {
      null: null,
      form: "form",
      info: {
        case: {
          form: undefined,
          root: {
            form: undefined,
            workflow: undefined,
          },
          workflow: undefined,
        },
        root: { form: "form", formMeta: { "is-top-form": true, level: 0 } },
      },
    });
  });

  skip("it recomputes hidden on hidden change of parent fieldset", async function () {});
  skip("it recomputes optional on hidden change of parent fieldset", async function () {});
  skip("it recomputes optional on hidden change of dependency", async function () {});
});
