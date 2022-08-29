import UIkit from "uikit";

export default function setupUIkitHelpers(assert) {
  assert.tooltipHasText = (element, selector, expected) => {
    const tooltip = UIkit.tooltip(element.querySelector(selector));

    return assert.strictEqual(
      tooltip.title,
      expected,
      `Expected tooltip to have title "${expected}" but got "${tooltip.title}"`
    );
  };
}
