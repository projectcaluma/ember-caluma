import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Library | form", function (hooks) {
  setupTest(hooks);

  test("it computes a pk", async function (assert) {
    assert.expect(1);

    const form = new (this.owner.factoryFor("caluma-model:form").class)({
      raw: {
        slug: "some-form",
        name: "Some Form",
        __typename: "Form",
      },
      owner: this.owner,
    });

    assert.strictEqual(form.pk, "Form:some-form");
  });
});
