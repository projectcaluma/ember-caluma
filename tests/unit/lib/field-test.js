import { settled } from "@ember/test-helpers";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";
import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import data from "./data";

import { parseDocument } from "ember-caluma/lib/parsers";

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
  });

  test("computes a pk", async function (assert) {
    assert.expect(1);

    const field = this.document.findField("question-1");

    assert.equal(field.pk, `${this.document.pk}:Question:question-1`);
  });

  test("computes isNew correctly", async function (assert) {
    assert.expect(3);

    const answeredField = this.document.findField("question-1");
    const unansweredField = this.document.findField("question-3");

    assert.equal(answeredField.isNew, false);
    assert.equal(unansweredField.isNew, true);

    answeredField.set("answer.value", null);

    assert.equal(answeredField.isNew, true);
  });

  test("can compute the question", async function (assert) {
    assert.expect(2);

    const field = this.document.findField("question-1");

    assert.equal(field.question.slug, "question-1");
    assert.equal(field.question.label, "Question 1");
  });

  test("can compute the answer", async function (assert) {
    assert.expect(4);

    const field = this.document.findField("question-1");
    const fieldWithoutAnswer = this.document.findField("question-3");

    assert.equal(field.answer.value, "test answer");
    assert.equal(fieldWithoutAnswer.answer.value, null);
    assert.equal(fieldWithoutAnswer.answer.__typename, "StringAnswer");
    assert.equal(fieldWithoutAnswer.answer.id, null);
  });

  test("it computes optional", async function (assert) {
    assert.expect(2);

    const dependsOnField = this.document.findField("question-1");
    const field = this.document.findField("question-2");

    dependsOnField.set("answer.value", "somevalue");
    assert.equal(field.optional, true);

    dependsOnField.set("answer.value", "require-question-2");
    assert.equal(field.optional, false);
  });

  test("it computes hidden", async function (assert) {
    assert.expect(2);

    const dependsOnField = this.document.findField("question-1");
    const field = this.document.findField("question-2");

    dependsOnField.set("answer.value", "somevalue");
    assert.equal(field.hidden, true);

    dependsOnField.set("answer.value", "show-question-2");
    assert.equal(field.hidden, false);
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

  test("computes the correct Jexl context", async function (assert) {
    assert.expect(1);

    const field = this.document.findField("question-1");

    assert.deepEqual(field.jexlContext, {
      form: "form",
      info: {
        form: "form",
        parent: null,
        root: { form: "form" },
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

    assert.equal(field.hidden, true);
    assert.equal(field.optional, false);
  });

  test("it can validate required fields", async function (assert) {
    assert.expect(1);

    const field = this.owner.factoryFor("caluma-model:field").create({
      raw: {
        question: {
          __typename: "TextQuestion",
          isHidden: "false",
          isRequired: "true",
        },
        answer: {
          stringValue: "",
          __typename: "StringAnswer",
        },
      },
      document: this.document,
    });

    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.blank:("presence":true,"value":"")',
    ]);
  });

  test("it ignores optional fields", async function (assert) {
    assert.expect(1);

    const field = this.owner.factoryFor("caluma-model:field").create({
      raw: {
        question: {
          __typename: "TextQuestion",
          isHidden: "false",
          isRequired: "false",
        },
        answer: null,
      },
      document: this.document,
    });

    await field.validate.perform();
    assert.deepEqual(field.errors, []);
  });

  test("it can validate text fields", async function (assert) {
    assert.expect(2);

    const field = this.owner.factoryFor("caluma-model:field").create({
      raw: {
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
      },
      document: this.document,
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

    const field = this.owner.factoryFor("caluma-model:field").create({
      raw: {
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
      },
      document: this.document,
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

    const field = this.owner.factoryFor("caluma-model:field").create({
      raw: {
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
      },
      document: this.document,
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

    const field = this.owner.factoryFor("caluma-model:field").create({
      raw: {
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
      },
      document: this.document,
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

    const field = this.owner.factoryFor("caluma-model:field").create({
      raw: {
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
      },
      document: this.document,
    });

    field.set("answer.value", "invalid-option");
    await field.validate.perform();
    assert.deepEqual(field.errors, [
      't:caluma.form.validation.inclusion:("allowBlank":true,"in":["option-1"],"value":"invalid-option")',
    ]);
  });

  test("it can validate checkbox fields", async function (assert) {
    assert.expect(2);

    const field = this.owner.factoryFor("caluma-model:field").create({
      raw: {
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
      },
      document: this.document,
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
});
