import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, triggerEvent } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Integration | Component | cf-field/input/file", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it computes the proper element id", async function(assert) {
    await render(hbs`{{cf-field/input/file field=(hash pk="test-id")}}`);

    assert.dom("#test-id").exists();
  });

  test("it allows to upload a file", async function(assert) {
    assert.expect(0);

    this.set("field", {
      answer: {
        id: btoa("FileAnswer:1"),
        value: {}
      }
    });

    this.set("onSave", name => ({
      value: { uploadUrl: `/minio/upload/${name}` }
    }));

    let payload_good = new File(["test"], "good.txt", { type: "text/plain" });
    let payload_fail = new File(["test"], "fail.txt", { type: "text/plain" });

    await render(hbs`{{cf-field/input/file field=field onSave=onSave}}`);

    await triggerEvent("input[type=file]", "change", { files: [] });
    await triggerEvent("input[type=file]", "change", { files: [payload_fail] });
    await triggerEvent("input[type=file]", "change", { files: [payload_good] });
  });

  test("it allows to download a file", async function(assert) {
    this.set("field", {
      answer: {
        id: btoa("FileAnswer:1"),
        value: {
          downloadUrl: "/minio/download/good.txt",
          name: "good.txt"
        }
      }
    });

    // Hijack window.open
    const window_open = window.open;
    window.open = (url, target) => {
      assert.ok(url.startsWith("http"), "The URL is an HTTP address");
      assert.equal(target, "_blank", "Target for new window is _blank");
    };

    await render(hbs`{{cf-field/input/file field=field}}`);

    assert.dom(".uk-button").exists();
    assert.dom(".uk-button").hasText(this.field.answer.value.name);

    // Skip this part until the Mirage/GraphQL stuff is sorted out.
    //await click(".uk-button");

    // Restore window.open
    // eslint-disable-next-line require-atomic-updates
    window.open = window_open;
  });
});
