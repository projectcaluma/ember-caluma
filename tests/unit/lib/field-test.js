import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { settled } from "@ember/test-helpers";
import Field from "ember-caluma/lib/field";
import Document from "ember-caluma/lib/document";
import faker from "faker";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";

module("Unit | Library | field", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register("service:validator", ValidatorServiceStub);

    const question = {
      __typename: "TextQuestion",
      slug: "test-question",
      label: "Test Question",
      isHidden: "false",
      isRequired: "true"
    };

    const answer = {
      __typename: "StringAnswer",
      id: btoa(`Answer:${faker.random.uuid()}`),
      stringValue: "test answer",
      question: question.slug
    };

    const document = { pk: "Document:xxxx-xxxx" };

    this.setProperties({ question, answer, document });
  });

  test("computes a pk", async function(assert) {
    assert.expect(1);

    const field = Field.create(this.owner.ownerInjection(), {
      raw: {
        question: this.question,
        answer: this.answer
      },
      document: this.document
    });

    assert.equal(field.pk, "Document:xxxx-xxxx:Question:test-question");
  });

  test("computes isNew correctly", async function(assert) {
    assert.expect(2);

    const field = Field.create(this.owner.ownerInjection(), {
      raw: { question: this.question, answer: this.answer },
      document: this.document
    });
    const newField = Field.create(this.owner.ownerInjection(), {
      raw: { question: this.question },
      document: this.document
    });

    assert.equal(field.isNew, false);
    assert.equal(newField.isNew, true);
  });

  test("can compute the question", async function(assert) {
    assert.expect(2);

    const field = Field.create(this.owner.ownerInjection(), {
      raw: {
        question: this.question,
        answer: this.answer
      },
      document: this.document
    });

    assert.equal(field.question.slug, "test-question");
    assert.equal(field.question.label, "Test Question");
  });

  test("can compute the answer", async function(assert) {
    assert.expect(4);

    const field = Field.create(this.owner.ownerInjection(), {
      raw: {
        question: this.question,
        answer: this.answer
      },
      document: this.document
    });

    assert.equal(field.answer.value, "test answer");

    const fieldWithoutAnswer = Field.create(this.owner.ownerInjection(), {
      raw: {
        question: this.question,
        answer: null
      },
      document: this.document
    });

    assert.equal(fieldWithoutAnswer.answer.value, null);
    assert.equal(fieldWithoutAnswer.answer.__typename, "StringAnswer");
    assert.equal(fieldWithoutAnswer.answer.id, null);
  });

  module("dependencies", function(hooks) {
    hooks.beforeEach(async function() {
      const question = {
        __typename: "TextQuestion",
        slug: "test-question-2",
        label: "Test Question 2",
        isHidden: "'test-question'|answer == 'hidequestion2'",
        isRequired: "'test-question'|answer == 'requirequestion2'"
      };

      const answer = {
        __typename: "StringAnswer",
        id: btoa(`Answer:${faker.random.uuid()}`),
        stringValue: "test answer 2",
        question: question.slug
      };

      const form = {
        __typename: "Form",
        slug: "test-form",
        name: "Test Form",
        questions: [this.question, question]
      };

      const document = Document.create(this.owner.ownerInjection(), {
        raw: {
          __typename: "Document",
          id: btoa(`Document:${faker.random.uuid()}`),
          rootForm: form,
          forms: [form],
          answers: [this.answer, answer]
        }
      });

      this.set("document", document);

      await settled();
    });

    test("it computes optional", async function(assert) {
      assert.expect(2);

      const dependsOnField = this.document.findField("test-question");
      const field = this.document.findField("test-question-2");

      dependsOnField.set("answer.value", "somevalue");
      assert.equal(await field.optionalTask.perform(), true);

      dependsOnField.set("answer.value", "requirequestion2");
      assert.equal(await field.optionalTask.perform(), false);
    });

    test("it computes hidden", async function(assert) {
      assert.expect(6);

      const dependsOnField = this.document.findField("test-question");
      const field = this.document.findField("test-question-2");

      field.on("hiddenChanged", () => assert.step("hidden-changed"));

      dependsOnField.set("answer.value", "somevalue");
      assert.equal(await field.hiddenTask.perform(), false);
      await settled();

      dependsOnField.set("answer.value", "someothervalue");
      assert.equal(await field.hiddenTask.perform(), false);
      await settled();

      dependsOnField.set("answer.value", "hidequestion2");
      assert.equal(await field.hiddenTask.perform(), true);
      await settled();

      assert.verifySteps(
        ["hidden-changed", "hidden-changed"],
        "The `hiddenChanged` event is only fired if the hidden state actually changes"
      );
    });

    test("it computes hiddenDependencies based on 'answer' transform", async function(assert) {
      assert.expect(1);

      const field = this.document.findField("test-question-2");

      assert.deepEqual(field.hiddenDependencies, ["test-question"]);
    });

    test("it computes optionalDependencies based on 'answer' transform", async function(assert) {
      assert.expect(1);

      const field = this.document.findField("test-question-2");

      assert.deepEqual(field.optionalDependencies, ["test-question"]);
    });

    test("it can handle newlines in JEXL expressions", async function(assert) {
      assert.expect(2);

      const field = this.document.findField("test-question-2");

      const whitespaced = "(\n  1 == 1\r    &&\r    2 == 2\n)";

      field.question.set("isHidden", whitespaced);
      field.question.set("isRequired", whitespaced);

      assert.equal(await field.hiddenTask.perform(), true);
      assert.equal(await field.optionalTask.perform(), false);
    });
  });

  module("validation", function() {
    hooks.beforeEach(function() {
      this.owner.register("service:validator", ValidatorServiceStub);
    });

    test("it can validate required fields", async function(assert) {
      assert.expect(1);

      const field = Field.create(this.owner.ownerInjection(), {
        raw: {
          question: {
            __typename: "TextQuestion"
          },
          answer: {
            stringValue: "Test",
            __typename: "StringAnswer"
          }
        },
        document: this.document
      });

      field.set("optional", false);
      field.set("answer.value", "");
      await field.validate.perform();
      assert.deepEqual(field.errors, ["This field can't be blank"]);
    });

    test("it ignores optional fields", async function(assert) {
      assert.expect(1);

      const field = Field.create(this.owner.ownerInjection(), {
        raw: {
          question: {
            __typename: "TextQuestion"
          },
          answer: null
        },
        document: this.document
      });

      field.set("optional", true);
      field.set("answer.value", "");
      await field.validate.perform();
      assert.deepEqual(field.errors, []);
    });

    test("it can validate text fields", async function(assert) {
      assert.expect(1);

      const field = Field.create(this.owner.ownerInjection(), {
        raw: {
          question: {
            textMaxLength: 4,
            __typename: "TextQuestion"
          },
          answer: {
            stringValue: "Test",
            __typename: "StringAnswer"
          }
        },
        document: this.document
      });

      field.set("answer.value", "Testx");
      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field can't be longer than 4 characters"
      ]);
    });

    test("it can validate textarea fields", async function(assert) {
      assert.expect(1);

      const field = Field.create(this.owner.ownerInjection(), {
        raw: {
          question: {
            textareaMaxLength: 4,
            __typename: "TextareaQuestion"
          },
          answer: {
            stringValue: "Test",
            __typename: "StringAnswer"
          }
        },
        document: this.document
      });

      field.set("answer.value", "Testx");
      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field can't be longer than 4 characters"
      ]);
    });

    test("it can validate integer fields", async function(assert) {
      assert.expect(3);

      const field = Field.create(this.owner.ownerInjection(), {
        raw: {
          question: {
            integerMinValue: 2,
            integerMaxValue: 2,
            __typename: "IntegerQuestion"
          },
          answer: {
            integerValue: 2,
            __typename: "IntegerAnswer"
          }
        },
        document: this.document
      });

      field.set("answer.integerValue", 1);
      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field must be greater than or equal to 2"
      ]);

      field.set("answer.integerValue", 3);
      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field must be less than or equal to 2"
      ]);

      field.set("answer.integerValue", 1.5);
      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field must be an integer"
      ]);
    });

    test("it can validate float fields", async function(assert) {
      assert.expect(3);

      const field = Field.create(this.owner.ownerInjection(), {
        raw: {
          question: {
            floatMinValue: 1.5,
            floatMaxValue: 2.5,
            __typename: "FloatQuestion"
          },
          answer: {
            floatValue: 2.0,
            __typename: "FloatAnswer"
          }
        },
        document: this.document
      });

      await field.validate.perform();
      assert.deepEqual(field.errors, []);

      field.set("answer.floatValue", 1.4);

      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field must be greater than or equal to 1.5"
      ]);

      field.set("answer.floatValue", 2.6);

      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field must be less than or equal to 2.5"
      ]);
    });

    test("it can validate radio fields", async function(assert) {
      assert.expect(1);

      const field = Field.create(this.owner.ownerInjection(), {
        raw: {
          question: {
            choiceOptions: {
              edges: [
                {
                  node: {
                    slug: "option-1"
                  }
                }
              ]
            },
            __typename: "ChoiceQuestion"
          },
          answer: {
            stringValue: "option-1",
            __typename: "StringAnswer"
          }
        },
        document: this.document
      });

      field.set("answer.value", "invalid-option");
      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "'invalid-option' is not a valid value for this field"
      ]);
    });

    test("it can validate checkbox fields", async function(assert) {
      assert.expect(2);

      const field = Field.create(this.owner.ownerInjection(), {
        raw: {
          question: {
            multipleChoiceOptions: {
              edges: [
                {
                  node: {
                    slug: "option-1"
                  }
                }
              ]
            },
            __typename: "MultipleChoiceQuestion"
          },
          answer: {
            listValue: ["option-1"],
            __typename: "ListAnswer"
          }
        },
        document: this.document
      });

      field.set("answer.listValue", ["option-1", "invalid-option"]);
      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "'invalid-option' is not a valid value for this field"
      ]);

      field.set("answer.listValue", ["invalid-option", "other-invalid-option"]);
      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "'invalid-option' is not a valid value for this field",
        "'other-invalid-option' is not a valid value for this field"
      ]);
    });
  });
});
