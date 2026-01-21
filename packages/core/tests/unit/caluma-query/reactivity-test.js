import { setComponentTemplate } from "@ember/component";
import { action } from "@ember/object";
import { render, click } from "@ember/test-helpers";
import Component from "@glimmer/component";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { useCalumaQuery } from "@projectcaluma/ember-core/caluma-query";
import { allWorkItems } from "@projectcaluma/ember-core/caluma-query/queries";
import { setupRenderingTest } from "dummy/tests/helpers";

class TestComponent extends Component {
  workItems = useCalumaQuery(this, allWorkItems, () => ({
    options: this.options,
  }));

  get options() {
    const processAll = this.args.processAll;

    return {
      pageSize: 5,
      ...(processAll ? { processAll } : {}),
    };
  }

  @action
  signalRender(id) {
    this.args.signalRender(id);
  }
}

setComponentTemplate(
  hbs`<ul>
  {{#each this.workItems.value as |workItem i|}}
    <li {{did-insert (fn this.signalRender i)}}>{{workItem.id}}</li>
  {{/each}}
</ul>
<button type="button" {{on "click" this.workItems.fetchMore}}>more</button>`,
  TestComponent,
);

module("Unit | Caluma Query | reactivity", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.server.createList("work-item", 10);

    this.component = TestComponent;
  });

  test("only re-renders new items per default", async function (assert) {
    this.signalRender = (i) => assert.step(`render-${i}`);

    await render(hbs`<this.component @signalRender={{this.signalRender}} />`);

    assert.verifySteps([
      "render-0",
      "render-1",
      "render-2",
      "render-3",
      "render-4",
    ]);

    await click("button");

    assert.verifySteps([
      "render-5",
      "render-6",
      "render-7",
      "render-8",
      "render-9",
    ]);
  });

  test("only re-renders new items if `processAll` does not alter data", async function (assert) {
    this.signalRender = (i) => assert.step(`render-${i}`);
    this.processAll = (items) => items.map((item) => ({ ...item }));

    await render(
      hbs`<this.component
  @signalRender={{this.signalRender}}
  @processAll={{this.processAll}}
/>`,
    );

    assert.verifySteps([
      "render-0",
      "render-1",
      "render-2",
      "render-3",
      "render-4",
    ]);

    await click("button");

    assert.verifySteps([
      "render-5",
      "render-6",
      "render-7",
      "render-8",
      "render-9",
    ]);
  });

  test("re-renders all items if `processAll` alters data", async function (assert) {
    this.signalRender = (i) => assert.step(`render-${i}`);
    this.processAll = (items) => items.map((item, i) => ({ ...item, sort: i }));

    await render(
      hbs`<this.component
  @signalRender={{this.signalRender}}
  @processAll={{this.processAll}}
/>`,
    );

    assert.verifySteps([
      "render-0",
      "render-1",
      "render-2",
      "render-3",
      "render-4",
    ]);

    await click("button");

    assert.verifySteps([
      "render-0",
      "render-1",
      "render-2",
      "render-3",
      "render-4",
      "render-5",
      "render-6",
      "render-7",
      "render-8",
      "render-9",
    ]);
  });
});
