import { render, triggerEvent, click } from "@ember/test-helpers";
import { faker } from "@faker-js/faker";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input/files", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks, ["en"]);

  test("it computes the proper element id", async function (assert) {
    await render(hbs`<CfField::Input::Files @field={{(hash pk="test-id")}} />`);

    assert.dom("#test-id").exists();
  });

  test("it allows to upload files", async function (assert) {
    assert.expect(10);

    this.field = new (class {
      answer = {
        raw: {
          id: btoa("FilesAnswer:1"),
        },
        value: null,
      };
      @tracked _errors = [];
    })();

    this.onSave = (files) => ({
      filesValue: files?.map((f) => ({
        name: f.name,
        id: faker.string.uuid(),
        uploadUrl: `/minio/upload/${f.name}`,
      })),
    });

    const payload_good_1 = new File(["test"], "good-1.txt", {
      type: "text/plain",
    });
    const payload_good_2 = new File(["test"], "good-2.txt", {
      type: "text/plain",
    });
    const payload_fail = new File(["test"], "fail.txt", { type: "text/plain" });

    await render(
      hbs`<CfField::Input::Files @field={{this.field}} @onSave={{this.onSave}} />`,
    );

    await triggerEvent("input[type=file]", "change", { files: [] });
    assert.strictEqual(this.field.answer.value, null);
    assert.deepEqual(this.field._errors, []);

    await triggerEvent("input[type=file]", "change", { files: [payload_fail] });
    assert.strictEqual(this.field.answer.value, null);
    assert.deepEqual(this.field._errors, [{ type: "uploadFailed" }]);

    // reset errors
    this.field._errors = [];

    await triggerEvent("input[type=file]", "change", {
      files: [payload_good_1],
    });
    assert.strictEqual(this.field.answer.value?.[0]?.name, "good-1.txt");
    assert.deepEqual(this.field._errors, []);

    await triggerEvent("input[type=file]", "change", {
      files: [payload_good_1, payload_good_2],
    });

    assert.strictEqual(this.field.answer.value?.[0]?.name, "good-1.txt");
    assert.strictEqual(this.field.answer.value?.[1]?.name, "good-1.txt");
    assert.strictEqual(this.field.answer.value?.[2]?.name, "good-2.txt");
    assert.deepEqual(this.field._errors, []);
  });

  test("it allows to download a file", async function (assert) {
    assert.expect(4);

    const file = this.server.create("file");

    this.field = {
      answer: {
        raw: {
          id: btoa("FilesAnswer:1"),
        },
        value: [file],
      },
    };

    // Hijack window.open
    const window_open = window.open;
    window.open = (url, target) => {
      assert.ok(url.startsWith("http"), "The URL is a HTTP address");
      assert.strictEqual(target, "_blank", "Target for new window is _blank");
    };

    await render(hbs`<CfField::Input::Files @field={{this.field}} />`);

    assert.dom(`[data-test-download-link="${file.id}"]`).exists();
    assert.dom(`[data-test-download-link="${file.id}"]`).hasText(file.name);

    await click("[data-test-download-link]");

    // Restore window.open
    // eslint-disable-next-line require-atomic-updates
    window.open = window_open;
  });

  test("it disables all controls when field is disabled", async function (assert) {
    assert.expect(2);

    const file = this.server.create("file");

    this.field = {
      answer: {
        raw: {
          id: btoa("FilesAnswer:1"),
        },
        value: [file],
      },
    };

    await render(
      hbs`<CfField::Input::Files @field={{this.field}} @disabled={{true}} />`,
    );

    assert.dom("input[type=file]").isDisabled();
    assert.dom(`[data-test-delete="${file.id}"]`).isNotVisible();
  });
});
