import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Library | fieldset", function (hooks) {
  setupTest(hooks);

  test("it computes a pk", async function (assert) {
    assert.expect(1);

    const fieldset = new (this.owner.factoryFor("caluma-model:fieldset").class)(
      {
        raw: {
          form: {
            __typename: "Form",
            slug: "some-form",
            questions: [],
          },
          answers: [],
        },
        document: { pk: "Document:xxx-xxx" },
        owner: this.owner,
      }
    );

    assert.strictEqual(fieldset.pk, "Document:xxx-xxx:Form:some-form");
  });
});
