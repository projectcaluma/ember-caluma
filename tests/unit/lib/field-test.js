import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Field from "ember-caluma/lib/field";

module("Unit | Library | field", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.question = {
      slug: "question-1",
      label: "Question 1",
      __typename: "TextQuestion"
    };

    this.document = {
      id: 1,
      answers: {
        edges: [
          {
            node: {
              stringValue: "Test",
              question: {
                slug: this.question.slug
              },
              __typename: "StringAnswer"
            }
          }
        ]
      }
    };

    this.answer = this.document.answers.edges[0].node;
  });

  test("can compute the question", async function(assert) {
    assert.expect(2);

    const field = Field.create(this.owner.ownerInjection(), {
      _question: this.question,
      _document: this.document,
      _answer: this.answer
    });

    assert.equal(field.question.slug, "question-1");
    assert.equal(field.question.label, "Question 1");
  });

  test("can compute the answer", async function(assert) {
    assert.expect(3);

    const field = Field.create(this.owner.ownerInjection(), {
      _question: this.question,
      _document: this.document,
      _answer: this.answer
    });

    assert.equal(field.answer.stringValue, "Test");

    const fieldWithoutAnswer = Field.create(this.owner.ownerInjection(), {
      _question: this.question,
      _document: this.document,
      _answer: null
    });

    assert.equal(fieldWithoutAnswer.answer.stringValue, null);
    assert.equal(fieldWithoutAnswer.answer.__typename, "StringAnswer");
  });

  test("it throws and error if arguments are missing", function(assert) {
    assert.expect(2);

    assert.throws(() => Field.create(), /Owner must be injected/);
    assert.throws(
      () => Field.create(this.owner.ownerInjection()),
      /_question must be passed/
    );
  });

  module("validation", function() {
    test("it can validate required fields", async function(assert) {
      assert.expect(2);

      const field = Field.create(this.owner.ownerInjection(), {
        _question: {
          isRequired: "true",
          __typename: "TextQuestion"
        },
        _document: {},
        _answer: {
          stringValue: "Test",
          __typename: "StringAnswer"
        }
      });

      await field.validate.perform();
      assert.deepEqual(field.errors, []);

      field.set("answer.stringValue", "");

      await field.validate.perform();
      assert.deepEqual(field.errors, ["This field can't be blank"]);
    });

    test("it ignores hidden required fields", async function(assert) {
      assert.expect(1);

      const field = Field.create(this.owner.ownerInjection(), {
        _question: {
          isRequired: "true",
          hidden: true,
          __typename: "TextQuestion"
        },
        _document: {}
      });

      await field.validate.perform();
      assert.deepEqual(field.errors, []);
    });

    test("it can validate text fields", async function(assert) {
      assert.expect(2);

      const field = Field.create(this.owner.ownerInjection(), {
        _question: {
          isRequired: "true",
          textMaxLength: 4,
          __typename: "TextQuestion"
        },
        _document: {},
        _answer: {
          stringValue: "Test",
          __typename: "StringAnswer"
        }
      });

      await field.validate.perform();
      assert.deepEqual(field.errors, []);

      field.set("answer.stringValue", "Testx");

      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field can't be longer than 4 characters"
      ]);
    });

    test("it can validate textarea fields", async function(assert) {
      assert.expect(2);

      const field = Field.create(this.owner.ownerInjection(), {
        _question: {
          isRequired: "true",
          textareaMaxLength: 4,
          __typename: "TextareaQuestion"
        },
        _document: {},
        _answer: {
          stringValue: "Test",
          __typename: "StringAnswer"
        }
      });

      await field.validate.perform();
      assert.deepEqual(field.errors, []);

      field.set("answer.stringValue", "Testx");

      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "The value of this field can't be longer than 4 characters"
      ]);
    });

    test("it can validate integer fields", async function(assert) {
      assert.expect(4);

      const field = Field.create(this.owner.ownerInjection(), {
        _question: {
          isRequired: "true",
          integerMinValue: 2,
          integerMaxValue: 2,
          __typename: "IntegerQuestion"
        },
        _document: {},
        _answer: {
          integerValue: 2,
          __typename: "IntegerAnswer"
        }
      });

      assert.equal(field._validateIntegerQuestion(), true);

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
        _question: {
          isRequired: "true",
          floatMinValue: 1.5,
          floatMaxValue: 2.5,
          __typename: "FloatQuestion"
        },
        _document: {},
        _answer: {
          floatValue: 2.0,
          __typename: "FloatAnswer"
        }
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
      assert.expect(2);

      const field = Field.create(this.owner.ownerInjection(), {
        _question: {
          isRequired: "true",
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
        _document: {},
        _answer: {
          stringValue: "option-1",
          __typename: "StringAnswer"
        }
      });

      await field.validate.perform();
      assert.deepEqual(field.errors, []);

      field.set("answer.stringValue", "invalid-option");

      await field.validate.perform();
      assert.deepEqual(field.errors, [
        "'invalid-option' is not a valid value for this field"
      ]);
    });

    test("it can validate checkbox fields", async function(assert) {
      assert.expect(3);

      const field = Field.create(this.owner.ownerInjection(), {
        _question: {
          isRequired: "true",
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
        _document: {},
        _answer: {
          listValue: ["option-1"],
          __typename: "ListAnswer"
        }
      });

      await field.validate.perform();
      assert.deepEqual(field.errors, []);

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
