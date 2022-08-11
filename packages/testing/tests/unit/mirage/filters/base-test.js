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
      { slug: "test-4", createdByUser: "1" },
      { slug: "test-5", createdByGroup: "1" },
      { slug: "test-6", modifiedByUser: "1" },
      { slug: "test-7", modifiedByGroup: "1" },
    ];
  });

  test("can filter records", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      this.filter.filter(this.collection, { filter: [{ slugs: ["test-1"] }] }),
      [{ slug: "test-1" }]
    );
  });

  test("can find records", async function (assert) {
    assert.expect(1);

    assert.deepEqual(this.filter.find(this.collection, { slug: "test-1" }), {
      slug: "test-1",
    });
  });

  test("can filter by createdByUser", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      this.filter.filter(this.collection, {
        filter: [{ createdByUser: "1" }],
      }),
      [
        {
          slug: "test-4",
          createdByUser: "1",
        },
      ]
    );
  });

  test("can filter by createdByGroup", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      this.filter.filter(this.collection, {
        filter: [{ createdByGroup: "1" }],
      }),
      [
        {
          slug: "test-5",
          createdByGroup: "1",
        },
      ]
    );
  });

  test("can filter by modifiedByUser", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      this.filter.filter(this.collection, {
        filter: [{ modifiedByUser: "1" }],
      }),
      [
        {
          slug: "test-6",
          modifiedByUser: "1",
        },
      ]
    );
  });

  test("can filter by modifiedByGroup", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      this.filter.filter(this.collection, {
        filter: [{ modifiedByGroup: "1" }],
      }),
      [
        {
          slug: "test-7",
          modifiedByGroup: "1",
        },
      ]
    );
  });

  test("does not fail if the filter is not defined", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      this.filter.filter(this.collection, { filter: [{ foo: "bar" }] }),
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
