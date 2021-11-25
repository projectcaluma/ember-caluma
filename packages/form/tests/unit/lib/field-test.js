import { set } from "@ember/object";
import { settled } from "@ember/test-helpers";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";
import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import data from "./data";

import { getDependenciesFromJexl } from "@projectcaluma/ember-form/lib/dependencies";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

module("Unit | Library | field", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    this.owner.register("service:validator", ValidatorServiceStub);

    this.set(
      "document",
      this.owner
        .factoryFor("caluma-model:document")
        .create({ raw: parseDocument(data) })
    );

    await settled();

    this.addField = (raw) =>
      this.owner.factoryFor("caluma-model:field").create({
        raw,
        fieldset: this.document.fieldsets[0],
        document: this.document,
      });
  });

  test("computes a pk", async function (assert) {
    assert.expect(1);

    const field = this.document.findField("question-1");

    assert.strictEqual(field.pk, `${this.document.pk}:Question:question-1`);
  });

  test("computes isNew correctly", async function (assert) {
    assert.expect(3);

    const answeredField = this.document.findField("question-1");
    const unansweredField = this.document.findField("question-3");

    assert.false(answeredField.isNew);
    assert.true(unansweredField.isNew);

    answeredField.set("answer.value", null);

    assert.true(answeredField.isNew);
  });

  test("can compute the question", async function (assert) {
    assert.expect(2);

    const field = this.document.findField("question-1");

    assert.strictEqual(field.question.slug, "question-1");
    assert.strictEqual(field.question.label, "Question 1");
  });

  test("can compute the answer", async function (assert) {
    assert.expect(4);

    const field = this.document.findField("question-1");
    const fieldWithoutAnswer = this.document.findField("question-3");

    assert.strictEqual(field.answer.value, "test answer");
    assert.strictEqual(fieldWithoutAnswer.answer.value, null);
    assert.strictEqual(fieldWithoutAnswer.answer.__typename, "StringAnswer");
    assert.strictEqual(fieldWithoutAnswer.answer.id, undefined);
  });

  test("it computes optional", async function (assert) {
    assert.expect(2);

    const dependsOnField = this.document.findField("question-1");
    const field = this.document.findField("question-2");

    dependsOnField.set("answer.value", "somevalue");
    assert.true(field.optional);

    dependsOnField.set("answer.value", "require-question-2");
    assert.false(field.optional);
  });

  test("it computes hidden", async function (assert) {
    assert.expect(2);

    const dependsOnField = this.document.findField("question-1");
    const field = this.document.findField("question-2");

    dependsOnField.set("answer.value", "somevalue");
    assert.true(field.hidden);

    dependsOnField.set("answer.value", "show-question-2");
    assert.false(field.hidden);
  });

  test("it computes hiddenDependencies based on 'answer' transform", async function (assert) {
    assert.expect(1);

    const field = this.document.findField("question-2");
    const dependentField = this.document.findField("question-1");

    assert.deepEqual(field.hiddenDependencies, [dependentField]);
  });

  test("it computes optionalDependencies based on 'answer' transform", async function (assert) {
    assert.expect(1);

    const field = this.document.findField("question-2");
    const dependentField = this.document.findField("question-1");

    assert.deepEqual(field.optionalDependencies, [dependentField]);
  });

  test("computes the correct jexl context", async function (assert) {
    assert.expect(1);

    const field = this.document
      .findField("table")
      .value[0].findField("table-form-question");

    assert.deepEqual(field.jexlContext, {
      null: null,
      form: "form",
      info: {
        form: "table-form",
        formMeta: {
          "is-top-form": false,
          level: 1,
        },
        parent: null,
        root: {
          form: "form",
          formMeta: {
            "is-top-form": true,
            level: 0,
          },
        },
      },
    });
  });

  test("computes isDefault correctly on simple fields", async function (assert) {
    assert.expect(2);

    const field = this.document.findField("question-1");

    assert.ok(field.isDefault);
    field.answer.value = "some other value";
    assert.notOk(field.isDefault);
  });

  test("computes isDefault correctly on table fields", async function (assert) {
    assert.expect(2);

    const field = this.document.findField("table");

    assert.ok(field.isDefault);
    field.answer.value[0].fields[0].value = "some other value";
    assert.notOk(field.isDefault);
  });

  test("it can handle newlines in Jexl expressions", async function (assert) {
    assert.expect(2);

    const field = this.document.findField("question-2");

    const whitespaced = "(\n  1 == 1\r    &&\r    2 == 2\n)";

    field.question.set("isHidden", whitespaced);
    field.question.set("isRequired", whitespaced);

    assert.true(field.hidden);
    assert.false(field.optional);
  });

  test("it can validate required fields", async function (assert) {
    assert.expect(1);

    const field = this.addField({
      question: {
        __typename: "TextQuestion",
        isHidden: "false",
        isRequired: "true",
      },
      answer: {
        stringValue: "",
        __typename: "StringAnswer",
      },
    });

    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.blank:("presence":true,"value":"")',
    ]);
  });

  test("it ignores optional fields", async function (assert) {
    assert.expect(1);

    const field = this.addField({
      question: {
        __typename: "TextQuestion",
        isHidden: "false",
        isRequired: "false",
      },
      answer: null,
    });

    await field.validate.perform();
    assert.deepEqual(field.errors, []);
  });

  test("it ignores required FormQuestion", async function (assert) {
    assert.expect(1);

    const field = this.addField({
      question: {
        __typename: "FormQuestion",
        isHidden: "false",
        isRequired: "true",
      },
      answer: null,
    });

    await field.validate.perform();
    assert.deepEqual(field.errors, []);
  });

  test("it can validate text fields", async function (assert) {
    assert.expect(2);

    const field = this.addField({
      question: {
        textMinLength: 2,
        textMaxLength: 4,
        isHidden: "false",
        isRequired: "true",
        __typename: "TextQuestion",
      },
      answer: {
        stringValue: "Test",
        __typename: "StringAnswer",
      },
    });

    field.set("answer.value", "Testx");
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.tooLong:("max":4,"min":2,"value":"Testx")',
    ]);

    field.set("answer.value", "x");
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.tooShort:("max":4,"min":2,"value":"x")',
    ]);
  });

  test("it can validate textarea fields", async function (assert) {
    assert.expect(2);

    const field = this.addField({
      question: {
        textareaMinLength: 2,
        textareaMaxLength: 4,
        isHidden: "false",
        isRequired: "true",
        __typename: "TextareaQuestion",
      },
      answer: {
        stringValue: "Test",
        __typename: "StringAnswer",
      },
    });

    field.set("answer.value", "Testx");
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.tooLong:("max":4,"min":2,"value":"Testx")',
    ]);

    field.set("answer.value", "x");
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.tooShort:("max":4,"min":2,"value":"x")',
    ]);
  });

  test("it can validate integer fields", async function (assert) {
    assert.expect(3);

    const field = this.addField({
      question: {
        integerMinValue: 2,
        integerMaxValue: 2,
        isHidden: "false",
        isRequired: "true",
        __typename: "IntegerQuestion",
      },
      answer: {
        integerValue: 2,
        __typename: "IntegerAnswer",
      },
    });

    field.set("answer.integerValue", 1);
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.greaterThanOrEqualTo:("gte":2,"integer":true,"lte":2,"value":1)',
    ]);

    field.set("answer.integerValue", 3);
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.lessThanOrEqualTo:("gte":2,"integer":true,"lte":2,"value":3)',
    ]);

    field.set("answer.integerValue", 1.5);
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.notAnInteger:("gte":2,"integer":true,"lte":2,"value":1.5)',
    ]);
  });

  test("it can validate float fields", async function (assert) {
    assert.expect(3);

    const field = this.addField({
      question: {
        floatMinValue: 1.5,
        floatMaxValue: 2.5,
        isHidden: "false",
        isRequired: "true",
        __typename: "FloatQuestion",
      },
      answer: {
        floatValue: 2.0,
        __typename: "FloatAnswer",
      },
    });

    await field.validate.perform();
    assert.deepEqual(field.errors, []);

    field.set("answer.floatValue", 1.4);

    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.greaterThanOrEqualTo:("gte":1.5,"lte":2.5,"value":1.4)',
    ]);

    field.set("answer.floatValue", 2.6);

    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.lessThanOrEqualTo:("gte":1.5,"lte":2.5,"value":2.6)',
    ]);
  });

  test("it can validate radio fields", async function (assert) {
    assert.expect(1);

    const field = this.addField({
      question: {
        choiceOptions: {
          edges: [
            {
              node: {
                slug: "option-1",
              },
            },
          ],
        },
        isHidden: "false",
        isRequired: "true",
        __typename: "ChoiceQuestion",
      },
      answer: {
        stringValue: "option-1",
        __typename: "StringAnswer",
      },
    });

    field.set("answer.value", "invalid-option");
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.inclusion:("allowBlank":true,"in":["option-1"],"value":"invalid-option")',
    ]);
  });

  test("it can validate checkbox fields", async function (assert) {
    assert.expect(2);

    const field = this.addField({
      question: {
        multipleChoiceOptions: {
          edges: [
            {
              node: {
                slug: "option-1",
              },
            },
          ],
        },
        isHidden: "false",
        isRequired: "true",
        __typename: "MultipleChoiceQuestion",
      },
      answer: {
        listValue: ["option-1"],
        __typename: "ListAnswer",
      },
    });

    field.set("answer.listValue", ["option-1", "invalid-option"]);
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.inclusion:("in":["option-1"],"value":"invalid-option")',
    ]);

    field.set("answer.listValue", ["invalid-option", "other-invalid-option"]);
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.inclusion:("in":["option-1"],"value":"invalid-option")',
      't:caluma.form.validation.inclusion:("in":["option-1"],"value":"other-invalid-option")',
    ]);
  });

  test("it can validate table fields", async function (assert) {
    assert.expect(2);

    const table = this.document.findField("table");
    const row = table.value[0];

    await table.validate.perform();
    assert.deepEqual(table.errors, []);

    row.findField("table-form-question").set("answer.value", null);
    await table.validate.perform();
    assert.deepEqual(table.errors, [
      't:caluma.form.validation.table:("value":null)',
    ]);
  });

  test("it can handle optional 'answer' transforms", async function (assert) {
    assert.expect(5);

    const field = this.addField({
      question: {
        __typename: "TextQuestion",
        isHidden: "'nonexistent'|answer('default') == 'default'",
        isRequired: "false",
      },
      answer: null,
    });

    assert.ok(field.hidden);

    field.question.set("isHidden", "'nonexistent'|answer(null) == null");
    assert.ok(field.hidden);

    field.question.set("answer", { value: null });
    assert.ok(field.hidden);

    assert.throws(() => {
      field.question.set("isHidden", "'nonexistent'|answer == null");
      field.hidden;
    }, /(Error while evaluating `isHidden` expression).*(Field for question `nonexistent` could not be found)/);

    assert.throws(() => {
      field.question.set("isRequired", "'nonexistent'|answer == null");
      field.optional;
    }, /(Error while evaluating `isRequired` expression).*(Field for question `nonexistent` could not be found)/);
  });

  module("dependencies", function () {
    test("calculates mapby dependencies correctly", async function (assert) {
      this.field = this.document.findField("json-dependency");

      assert.deepEqual(
        getDependenciesFromJexl(
          this.field.document.jexl,
          this.field.question.isHidden
        ),
        ["table", "table.table-form-question", "table.table-form-question-2"]
      );

      assert.deepEqual(
        [
          ...new Set(
            this.field.hiddenDependencies.map((field) => field.question.slug)
          ),
        ],
        ["table", "table-form-question", "table-form-question-2"]
      );
    });

    test("calculates optional dependencies correctly", async function (assert) {
      this.field = this.document.findField("question-2");

      assert.deepEqual(
        getDependenciesFromJexl(
          this.field.document.jexl,
          this.field.question.isRequired
        ),
        ["question-1"]
      );

      assert.deepEqual(
        this.field.optionalDependencies.map((field) => field.question.slug),
        ["question-1"]
      );
    });

    test("calculates dependencies correctly if the answer transform on a table is followed by a stringify transform", async function (assert) {
      this.field = this.document.findField("json-dependency");

      set(this.field.question, "isRequired", "'table'|answer|stringify == []");

      assert.deepEqual(
        getDependenciesFromJexl(
          this.field.document.jexl,
          this.field.question.isRequired
        ),
        ["table", "table.__all__"]
      );

      assert.deepEqual(
        [
          ...new Set(
            this.field.optionalDependencies.map((field) => field.question.slug)
          ),
        ],
        ["table", "table-form-question", "table-form-question-2"]
      );

      set(this.field.question, "isRequired", "false");
    });
  });

  module("calculated", function (hooks) {
    hooks.beforeEach(function () {
      this.calculated = this.document.findField("calculated");
      this.float = this.document.findField("float");
      this.table = this.document
        .findField("table")
        .value[0].findField("table-form-question");
    });

    test("calculates the correct value", async function (assert) {
      assert.expect(1);

      // 1.1 + 5 * 100 = 501.1
      assert.strictEqual(this.calculated.value, 501.1);
    });

    test("recalculates when a dependent value changes", async function (assert) {
      assert.expect(2);

      this.set("float.value", 2);
      assert.strictEqual(this.calculated.value, 502);

      this.set("table.value", "test");
      assert.strictEqual(this.calculated.value, 100);
    });

    test("recalculates when a dependent hidden state changes", async function (assert) {
      assert.expect(1);

      this.set("float.question.isHidden", "true");
      assert.strictEqual(this.calculated.value, null);
    });
  });
});
