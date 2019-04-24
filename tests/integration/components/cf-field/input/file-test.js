import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, render, triggerEvent } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | cf-field/input/file", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders", async function(assert) {
    await render(hbs`{{cf-field/input/file}}`);
    assert.ok(this.element);
  });

  test("it allows to upload a file", async function(assert) {
    assert.expect(0);

    this.set("onSave", name => ({
      fileValue: { uploadUrl: `/minio/upload/${name}` }
    }));

    let payload_good = new File(["test"], "good.txt", { type: "text/plain" });
    let payload_fail = new File(["test"], "fail.txt", { type: "text/plain" });

    await render(hbs`{{cf-field/input/file onSave=onSave}}`);

    await triggerEvent("input[type=file]", "change", []);
    await triggerEvent("input[type=file]", "change", [payload_fail]);
    await triggerEvent("input[type=file]", "change", [payload_good]);
  });

  test("it allows to download a file", async function(assert) {
    this.set("field", {
      answer: {
        id: btoa("FileAnswer:1"),
        fileValue: {
          downloadUrl: "/minio/download/good.txt"
        }
      }
    });

    const window_open = window.open;
    window.open = (url, target) => {
      assert.ok(url.startsWith("http"), "The URL is an HTTP address");
      assert.equal(target, "_blank", "Target for new window is _blank");
    };

    await render(hbs`{{cf-field/input/file field=field}}`);

    assert.dom("[data-test-file-download]").exists();
    await click("[data-test-file-download] button");

    window.open = window_open;
  });
});
