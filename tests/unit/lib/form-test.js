import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Library | form", function (hooks) {
  setupTest(hooks);

  test("it computes a pk", async function (assert) {
    assert.expect(1);

    const form = this.owner.factoryFor("caluma-model:form").create({
      raw: {
        slug: "some-form",
        name: "Some Form",
        __typename: "Form",
      },
    });

    assert.equal(form.pk, "Form:some-form");
  });
});
