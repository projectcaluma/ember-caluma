import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { settled } from "@ember/test-helpers";
import Field from "ember-caluma/lib/field";
import Document from "ember-caluma/lib/document";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";

module("Unit | Library | field", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function() {
    this.owner.register("service:validator", ValidatorServiceStub);

    const question = {
      __typename: "TextQuestion",
      slug: "test-question",
      label: "Test Question",
      isHidden: "false",
      isRequired: "true"
    };

    const question2 = {
      __typename: "TextQuestion",
      slug: "test-question-2",
      label: "Test Question 2",
      isHidden: "'test-question'|answer == 'hidequestion2'",
      isRequired: "'test-question'|answer == 'requirequestion2'"
    };

    const question3 = {
      __typename: "TextQuestion",
      slug: "test-question-3",
      label: "Test Question 3",
      isHidden: "false",
      isRequired: "false"
    };

    const answer = {
      __typename: "StringAnswer",
      id: btoa(`Answer:xxxx-xxxx`),
      stringValue: "test answer",
      question: { slug: question.slug }
    };

    const answer2 = {
      __typename: "StringAnswer",
      id: btoa(`Answer:yyyy-yyyy`),
      stringValue: "test answer 2",
      question: { slug: question2.slug }
    };

    const form = {
      __typename: "Form",
      slug: "test-form",
      name: "Test Form",
      questions: [question, question2, question3]
    };

    const document = Document.create(this.owner.ownerInjection(), {
      raw: {
        __typename: "Document",
        id: btoa(`Document:xxxx-xxxx`),
        rootForm: form,
        forms: [form],
        answers: [answer, answer2]
      }
    });

    this.setProperties({
      question,
      question2,
      question3,
      answer,
      answer2,
      document
    });

    await settled();
  });

  test("computes a pk", async function(assert) {
    assert.expect(1);

    const field = this.document.findField("test-question");

    assert.equal(field.pk, "Document:xxxx-xxxx:Question:test-question");
  });

  test("computes isNew correctly", async function(assert) {
    assert.expect(2);

    assert.equal(this.document.findField("test-question").isNew, false);
    assert.equal(this.document.findField("test-question-3").isNew, true);
  });

  test("can compute the question", async function(assert) {
    assert.expect(2);

    const field = this.document.findField("test-question");

    assert.equal(field.question.slug, "test-question");
    assert.equal(field.question.label, "Test Question");
  });

  test("can compute the answer", async function(assert) {
    assert.expect(4);

    const field = this.document.findField("test-question");
    const fieldWithoutAnswer = this.document.findField("test-question-3");

    assert.equal(field.answer.value, "test answer");
    assert.equal(fieldWithoutAnswer.answer.value, null);
    assert.equal(fieldWithoutAnswer.answer.__typename, "StringAnswer");
    assert.equal(fieldWithoutAnswer.answer.id, null);
  });

  test("it computes optional", async function(assert) {
    assert.expect(2);

    const dependsOnField = this.document.findField("test-question");
    const field = this.document.findField("test-question-2");

    dependsOnField.set("answer.value", "somevalue");
    assert.equal(field.optional, true);

    dependsOnField.set("answer.value", "requirequestion2");
    assert.equal(field.optional, false);
  });

  test("it computes hidden", async function(assert) {
    assert.expect(3);

    const dependsOnField = this.document.findField("test-question");
    const field = this.document.findField("test-question-2");

    dependsOnField.set("answer.value", "somevalue");
    assert.equal(field.hidden, false);

    dependsOnField.set("answer.value", "someothervalue");
    assert.equal(field.hidden, false);

    dependsOnField.set("answer.value", "hidequestion2");
    assert.equal(field.hidden, true);
  });

  test("it computes hiddenDependencies based on 'answer' transform", async function(assert) {
    assert.expect(1);

    const field = this.document.findField("test-question-2");
    const dependentField = this.document.findField("test-question");

    assert.deepEqual(field.hiddenDependencies, [dependentField]);
  });

  test("it computes optionalDependencies based on 'answer' transform", async function(assert) {
    assert.expect(1);

    const field = this.document.findField("test-question-2");
    const dependentField = this.document.findField("test-question");

    assert.deepEqual(field.optionalDependencies, [dependentField]);
  });

  test("it can handle newlines in JEXL expressions", async function(assert) {
    assert.expect(2);

    const field = this.document.findField("test-question-2");

    const whitespaced = "(\n  1 == 1\r    &&\r    2 == 2\n)";

    field.question.set("isHidden", whitespaced);
    field.question.set("isRequired", whitespaced);

    assert.equal(field.hidden, true);
    assert.equal(field.optional, false);
  });

  test("it can validate required fields", async function(assert) {
    assert.expect(1);

    const field = Field.create(this.owner.ownerInjection(), {
      raw: {
        question: {
          __typename: "TextQuestion",
          isHidden: "false",
          isRequired: "true"
        },
        answer: {
          stringValue: "",
          __typename: "StringAnswer"
        }
      },
      document: this.document
    });

    await field.validate.perform();
    assert.deepEqual(field.errors, ["This field can't be blank"]);
  });

  test("it ignores optional fields", async function(assert) {
    assert.expect(1);

    const field = Field.create(this.owner.ownerInjection(), {
      raw: {
        question: {
          __typename: "TextQuestion",
          isHidden: "false",
          isRequired: "false"
        },
        answer: null
      },
      document: this.document
    });

    await field.validate.perform();
    assert.deepEqual(field.errors, []);
  });

  test("it can validate text fields", async function(assert) {
    assert.expect(1);

    const field = Field.create(this.owner.ownerInjection(), {
      raw: {
        question: {
          textMaxLength: 4,
          isHidden: "false",
          isRequired: "true",
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
          isHidden: "false",
          isRequired: "true",
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
          isHidden: "false",
          isRequired: "true",
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
          isHidden: "false",
          isRequired: "true",
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
          isHidden: "false",
          isRequired: "true",
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
          isHidden: "false",
          isRequired: "true",
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
