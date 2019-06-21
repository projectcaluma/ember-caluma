import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Form from "ember-caluma/lib/form";

module("Unit | Library | form", function(hooks) {
  setupTest(hooks);

  test("it computes a pk", async function(assert) {
    assert.expect(1);

    const form = Form.create(this.owner.ownerInjection(), {
      raw: {
        slug: "some-form",
        name: "Some Form",
        __typename: "Form"
      }
    });

    assert.equal(form.pk, "Form:some-form");
  });
});
