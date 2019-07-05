import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Fieldset from "ember-caluma/lib/fieldset";

module("Unit | Library | fieldset", function(hooks) {
  setupTest(hooks);

  test("it computes a pk", async function(assert) {
    assert.expect(1);

    const fieldset = Fieldset.create(this.owner.ownerInjection(), {
      raw: {
        form: {
          __typename: "Form",
          slug: "some-form",
          questions: []
        },
        answers: []
      },
      document: { pk: "Document:xxx-xxx" }
    });

    assert.equal(fieldset.pk, "Document:xxx-xxx:Form:some-form");
  });
});
