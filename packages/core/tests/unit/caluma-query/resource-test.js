import { setOwner } from "@ember/application";
import { waitUntil } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import { useCalumaQuery } from "@projectcaluma/ember-core/caluma-query";
import { allWorkItems } from "@projectcaluma/ember-core/caluma-query/queries";

module("Unit | Caluma Query | resource", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.server.createList("work-item", 7, { status: "READY" });
    this.server.createList("work-item", 3, { status: "COMPLETED" });

    this.obj = new (class {
      workItems = useCalumaQuery(this, allWorkItems, () => ({
        options: { pageSize: this.pageSize },
        filter: [{ status: this.status }],
      }));

      @tracked pageSize = 5;
      @tracked status = "READY";
    })();
    setOwner(this.obj, this.owner);
  });

  test("exposes the same properties as the decorator", async function (assert) {
    assert.deepEqual(this.obj.workItems.value, []);

    await waitUntil(() => this.obj.workItems.isLoading === false);

    assert.strictEqual(this.obj.workItems.isLoading, false);
    assert.strictEqual(this.obj.workItems.hasNextPage, true);
    assert.strictEqual(this.obj.workItems.totalCount, 7);
  });

  test("fetches data on init", async function (assert) {
    assert.strictEqual(this.obj.workItems.value.length, 0);
    await waitUntil(() => this.obj.workItems.isLoading === false);
    assert.strictEqual(this.obj.workItems.value.length, 5);
  });

  test("refetches data on update of a filter", async function (assert) {
    await waitUntil(() => this.obj.workItems.value.length === 5);

    this.obj.status = "COMPLETED";
    await waitUntil(() => this.obj.workItems.isLoading === false);

    assert.strictEqual(this.obj.workItems.value.length, 3);
  });

  test("refetches data on update of an option", async function (assert) {
    await waitUntil(() => this.obj.workItems.value.length === 5);

    this.obj.pageSize = 1;
    await waitUntil(() => this.obj.workItems.isLoading === false);

    assert.strictEqual(this.obj.workItems.value.length, 1);
  });

  test("exposes a fetchMore method", async function (assert) {
    await waitUntil(() => this.obj.workItems.value.length === 5);

    this.obj.workItems.fetchMore();

    await waitUntil(() => this.obj.workItems.value.length === 7);

    assert.strictEqual(this.obj.workItems.hasNextPage, false);
  });
});
