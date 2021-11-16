import { render, triggerEvent, waitUntil, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cf-field/input/file", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("it computes the proper element id", async function (assert) {
    await render(hbs`{{cf-field/input/file field=(hash pk="test-id")}}`);

    assert.dom("#test-id").exists();
  });

  test("it allows to upload a file", async function (assert) {
    assert.expect(6);

    this.set("field", {
      answer: {
        id: btoa("FileAnswer:1"),
        value: {},
      },
    });

    this.set("onSave", (name) => ({
      fileValue: { uploadUrl: `/minio/upload/${name}` },
    }));

    const payload_good = new File(["test"], "good.txt", { type: "text/plain" });
    const payload_fail = new File(["test"], "fail.txt", { type: "text/plain" });

    await render(hbs`{{cf-field/input/file field=field onSave=onSave}}`);

    await triggerEvent("input[type=file]", "change", { files: [] });
    assert.strictEqual(this.field.answer.value.name, undefined);
    assert.strictEqual(this.field._errors, undefined);

    await triggerEvent("input[type=file]", "change", { files: [payload_fail] });
    await waitUntil(() => this.field._errors?.[0]?.type === "uploadFailed", {
      timeout: 2000,
    });
    assert.strictEqual(this.field.answer.value.name, undefined);
    assert.strictEqual(this.field._errors?.[0]?.type, "uploadFailed");

    this.set("field", {
      answer: {
        id: btoa("FileAnswer:1"),
        value: {},
      },
    });

    await triggerEvent("input[type=file]", "change", { files: [payload_good] });
    await waitUntil(() => this.field.answer.value.name === "good.txt", {
      timeout: 2000,
    });
    assert.strictEqual(this.field.answer.value.name, "good.txt");
    assert.strictEqual(this.field._errors, undefined);
  });

  test("it allows to download a file", async function (assert) {
    assert.expect(4);

    this.server.create("file");

    this.set("field", {
      answer: {
        id: btoa("FileAnswer:1"),
        value: {
          downloadUrl: "/minio/download/good.txt",
          name: "good.txt",
        },
      },
    });

    // Hijack window.open
    const window_open = window.open;
    window.open = (url, target) => {
      assert.ok(url.startsWith("http"), "The URL is a HTTP address");
      assert.strictEqual(target, "_blank", "Target for new window is _blank");
    };

    await render(hbs`<CfField::Input::File @field={{this.field}} />`);

    assert.dom("[data-test-download-link]").exists();
    assert
      .dom("[data-test-download-link]")
      .hasText(this.field.answer.value.name);

    await click("[data-test-download-link]");

    // Restore window.open
    // eslint-disable-next-line require-atomic-updates
    window.open = window_open;
  });
});
