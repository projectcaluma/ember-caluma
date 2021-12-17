import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

module("Unit | Mirage GraphQL Filter | base", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.filter = new BaseFilter();

    this.collection = [
      { slug: "test-1" },
      { slug: "test-2" },
      { slug: "test-3" },
    ];
  });

  test("can filter records", async function (assert) {
    assert.expect(1);

    assert.deepEqual(this.filter.filter(this.collection, { slug: "test-1" }), [
      {
        slug: "test-1",
      },
    ]);
  });

  test("can find records", async function (assert) {
    assert.expect(1);

    assert.deepEqual(this.filter.find(this.collection, { slug: "test-1" }), {
      slug: "test-1",
    });
  });

  test("does not fail if the filter is not defined", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      this.filter.filter(this.collection, { foo: "bar" }),
      this.collection
    );
  });

  test("does not fail if an empty filter is passed in", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      this.filter.filter(this.collection, {
        filter: [{}],
      }),
      this.collection
    );
  });
});
