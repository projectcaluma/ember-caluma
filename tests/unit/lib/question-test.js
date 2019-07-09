import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Question from "ember-caluma/lib/question";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";

module("Unit | Library | question", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register("service:validator", ValidatorServiceStub);
  });

  test("it computes a pk", async function(assert) {
    assert.expect(1);

    const question = Question.create(this.owner.ownerInjection(), {
      raw: {
        slug: "some-question",
        label: "Test",
        isRequired: "true",
        isHidden: "false",
        __typename: "TextQuestion"
      }
    });

    assert.equal(question.pk, "Question:some-question");
  });
});
