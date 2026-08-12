import { setComponentTemplate } from "@ember/component";
import { render } from "@ember/test-helpers";
import Component from "@glimmer/component";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";
import UIkit from "uikit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-inquiry-status-icon", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders the icon of the status", async function (assert) {
    this.status = {
      slug: "positive",
      label: "Positive",
      color: "success",
      icon: "check",
    };

    await render(hbs`<CdInquiryStatusIcon @status={{this.status}} />`, {
      owner: this.engine,
    });

    assert.dom("[uk-icon]").hasAttribute("icon", "check");
    assert.dom("[uk-icon]").hasClass("uk-text-success");
    assert.tooltipHasText(this.element, "[uk-icon]", "Positive");
    assert.deepEqual(
      UIkit.tooltip(this.element.querySelector("[uk-icon]")).pos,
      ["top", "center"], // UIkit adds "center" automatically
    );
  });

  test("it passes the tooltip position", async function (assert) {
    this.status = {
      slug: "negative",
      label: "Negative",
      color: "danger",
      icon: "close",
    };

    await render(
      hbs`<CdInquiryStatusIcon @status={{this.status}} @tooltipPos="left" />`,
      { owner: this.engine },
    );

    assert.deepEqual(
      UIkit.tooltip(this.element.querySelector("[uk-icon]")).pos,
      ["left", "center"], // UIkit adds "center" automatically
    );
  });

  test("it renders a custom icon component", async function (assert) {
    // eslint-disable-next-line ember/no-empty-glimmer-component-classes
    class CustomIconComponent extends Component {}
    setComponentTemplate(
      hbs`<span class="custom-icon">✨</span>`,
      CustomIconComponent,
    );

    this.status = {
      slug: "custom",
      label: "Custom!",
      color: "success",
      iconComponent: CustomIconComponent,
    };

    await render(hbs`<CdInquiryStatusIcon @status={{this.status}} />`, {
      owner: this.engine,
    });

    assert.dom("[uk-icon]").doesNotExist();
    assert.dom(".custom-icon").hasText("✨");
  });
});
