import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, settled } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | cfb-navigation", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.nav = this.owner.lookup("service:navigation");

    this.nav.pushEntry(1, { title: "foo", link: ["foo", 1] });
    this.nav.pushEntry(2, { title: "bar", link: ["bar", 2] });
    this.nav.pushEntry(3, { title: "baz", link: ["baz", 3] });
  });

  test("it renders", async function(assert) {
    assert.expect(2);

    await render(hbs`{{cfb-navigation}}`);

    assert.dom("ul.uk-breadcrumb").exists();
    assert.dom("ul.uk-breadcrumb > li").exists({ count: 3 });
  });

  test("it only renders the last x (3 per default) items", async function(assert) {
    assert.expect(3);

    this.nav.pushEntry(4, { title: "bla", link: ["bla", 4] });

    await render(hbs`{{cfb-navigation}}`);

    assert.dom("ul.uk-breadcrumb > li").exists({ count: 3 });
    assert.dom("li:last-child > a").hasText("bla");

    await render(hbs`{{cfb-navigation maxItems=1}}`);

    assert.dom("ul.uk-breadcrumb > li").exists({ count: 1 });
  });

  test("it can navigate", async function(assert) {
    assert.expect(4);

    let router = this.owner.lookup("service:router");

    this.owner.set("mountPoint", "mount");

    router.set("transitionTo", (routeName, ...args) => {
      assert.equal(routeName, "mount.baz");
      assert.deepEqual(args, [3]);
    });

    await render(hbs`{{cfb-navigation}}`);

    await click("li:last-child > a");

    this.nav.pushEntry(4, { title: "index", link: ["application", 4] });

    await settled();

    router.set("transitionTo", (routeName, ...args) => {
      assert.equal(routeName, "mount");
      assert.deepEqual(args, [4]);
    });

    await click("li:last-child > a");
  });
});
