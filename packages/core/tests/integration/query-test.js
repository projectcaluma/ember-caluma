import { action } from "@ember/object";
import { render, click } from "@ember/test-helpers";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import calumaQuery from "@projectcaluma/ember-core/caluma-query";
import { allWorkItems } from "@projectcaluma/ember-core/caluma-query/queries";

class QueryComponent extends Component {
  @calumaQuery({ query: allWorkItems, options: { pageSize: 5 } }) query;

  @tracked status = "READY";

  @action
  toggle() {
    this.status = this.status === "READY" ? "COMPLETED" : "READY";
  }

  @action
  fetch() {
    this.query.fetch({ filter: [{ status: this.status }] });
  }

  @action
  more() {
    this.query.fetchMore();
  }
}

const template = hbs`
  <button id="toggle" type="button" {{on "click" this.toggle}}>toggle</button>
  <ul
    {{did-insert this.fetch}}
    {{did-update this.fetch this.status}}
  >
    {{#each this.query.value as |item|}}
      <li>{{item.id}}</li>
    {{/each}}
  </ul>
  {{#if this.query.hasNextPage}}
    <button id="more" type="button" {{on "click" this.more}}>more</button>
  {{/if}}
`;

module("Integration | Caluma Query", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.server.createList("work-item", 8, { status: "READY" });
    this.server.createList("work-item", 3, { status: "COMPLETED" });

    this.owner.register("component:query", QueryComponent);
    this.owner.register("template:components/query", template);
  });

  test("fetches on render", async function (assert) {
    assert.expect(1);

    await render(hbs`<Query />`);

    assert.dom("ul > li").exists({ count: 5 });
  });

  test("can fetch more", async function (assert) {
    assert.expect(4);

    await render(hbs`<Query />`);

    assert.dom("ul > li").exists({ count: 5 });
    assert.dom("#more").exists();

    await click("#more");

    assert.dom("ul > li").exists({ count: 8 });
    assert.dom("#more").doesNotExist();
  });

  test("triggers fetch on status change", async function (assert) {
    assert.expect(2);

    await render(hbs`<Query />`);

    assert.dom("ul > li").exists({ count: 5 });

    await click("#toggle");

    assert.dom("ul > li").exists({ count: 3 });
  });
});
