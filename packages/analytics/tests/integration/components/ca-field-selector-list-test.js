import { render, findAll } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { reorder } from "ember-sortable/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | ca-field-selector-list", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    const edges = [
      {
        node: {
          id: "QW5hbHl0aWNzRmllbGQ6MDc5ZmY2OGYtMWExOS00ZGI0LWIwOWEtMTY3Zjc3NjY5Yzhl",
          alias: "id",
          meta: {},
          dataSource: "id",
          function: "VALUE",
          showOutput: true,
          filters: [],
          __typename: "AnalyticsField",
        },
        __typename: "AnalyticsFieldEdge",
      },
      {
        node: {
          id: "QW5hbHl0aWNzRmllbGQ6MGZmZDM5NTEtOWJkMC00NGYwLThkZDEtMzZkYjg0ZjQzODEz",
          alias: "answer",
          meta: {},
          dataSource: "answers[formular].frage",
          function: "COUNT",
          showOutput: true,
          filters: [],
          __typename: "AnalyticsField",
        },
        __typename: "AnalyticsFieldEdge",
      },
      {
        node: {
          id: "QW5hbHl0aWNzRmllbGQ6ZmQxZjNiM2ItNjQ2NC00ZmE2LWEwNGQtNDAwM2YzOTA2OWI0",
          alias: "created_at",
          meta: {},
          dataSource: "created_at",
          function: "VALUE",
          showOutput: true,
          filters: [],
          __typename: "AnalyticsField",
        },
        __typename: "AnalyticsFieldEdge",
      },
    ];
    this.set("order", edges);
    this.set("analyticsTable", {
      id: "QW5hbHl0aWNzVGFibGU6ZG9jdW1lbnQ=",
      slug: "document",
      name: "document",
      fields: {
        edges,
        __typename: "AnalyticsFieldConnection",
      },
      availableFields: {
        edges: [
          {
            node: {
              id: "QXZhaWxhYmxlRmllbGQ6YW5zd2Vyc1szLXF1ZXN0aW9uc10=",
              label: "answers[3-questions]",
              isLeaf: false,
              isValue: false,
              sourcePath: "answers[3-questions]",
              supportedFunctions: [],
              __typename: "AvailableField",
            },
            __typename: "AvailableFieldEdge",
          },
          {
            node: {
              id: "QXZhaWxhYmxlRmllbGQ6YW5zd2Vyc1tmb3JtdWxhci0xXQ==",
              label: "answers[formular-1]",
              isLeaf: false,
              isValue: false,
              sourcePath: "answers[formular-1]",
              supportedFunctions: [],
              __typename: "AvailableField",
            },
            __typename: "AvailableFieldEdge",
          },
          {
            node: {
              id: "QXZhaWxhYmxlRmllbGQ6YW5zd2Vyc1tmb3JtdWxhcl0=",
              label: "answers[formular]",
              isLeaf: false,
              isValue: false,
              sourcePath: "answers[formular]",
              supportedFunctions: [],
              __typename: "AvailableField",
            },
            __typename: "AvailableFieldEdge",
          },
          {
            node: {
              id: "QXZhaWxhYmxlRmllbGQ6Y3JlYXRlZF9hdA==",
              label: "created_at",
              isLeaf: false,
              isValue: true,
              sourcePath: "created_at",
              supportedFunctions: ["VALUE", "MAX", "MIN", "COUNT"],
              __typename: "AvailableField",
            },
            __typename: "AvailableFieldEdge",
          },
          {
            node: {
              id: "QXZhaWxhYmxlRmllbGQ6Zm9ybV9pZA==",
              label: "form_id",
              isLeaf: true,
              isValue: true,
              sourcePath: "form_id",
              supportedFunctions: ["COUNT", "VALUE"],
              __typename: "AvailableField",
            },
            __typename: "AvailableFieldEdge",
          },
          {
            node: {
              id: "QXZhaWxhYmxlRmllbGQ6aWQ=",
              label: "id",
              isLeaf: true,
              isValue: true,
              sourcePath: "id",
              supportedFunctions: ["COUNT", "VALUE"],
              __typename: "AvailableField",
            },
            __typename: "AvailableFieldEdge",
          },
          {
            node: {
              id: "QXZhaWxhYmxlRmllbGQ6bWV0YQ==",
              label: "Meta",
              isLeaf: false,
              isValue: false,
              sourcePath: "meta",
              supportedFunctions: [
                "VALUE",
                "SUM",
                "COUNT",
                "AVG",
                "MAX",
                "MIN",
              ],
              __typename: "AvailableField",
            },
            __typename: "AvailableFieldEdge",
          },
        ],
        __typename: "AvailableFieldConnection",
      },
      startingObject: "DOCUMENTS",
      __typename: "AnalyticsTable",
    });
  });

  test("it renders fields", async function (assert) {
    await render(
      hbs`<CaFieldSelectorList @analyticsTable={{this.analyticsTable}} />`,
    );

    assert.dom("tbody tr").exists({ count: 3 });
  });

  test("it reorders", async function (assert) {
    await render(
      hbs`<CaFieldSelectorList @analyticsTable={{this.analyticsTable}} />`,
    );

    assert
      .dom("tbody tr:nth-child(1)")
      .hasAttribute("id", this.order[0].node.id);
    assert
      .dom("tbody tr:nth-child(2)")
      .hasAttribute("id", this.order[1].node.id);
    assert
      .dom("tbody tr:nth-child(3)")
      .hasAttribute("id", this.order[2].node.id);

    const order = findAll("[data-test-sort-handle]").reverse();
    // reorder fails on floating and compatibility tests
    await reorder("mouse", "[data-test-sort-handle]", ...order);

    assert
      .dom("tbody tr:nth-child(1)")
      .hasAttribute("id", this.order[2].node.id);
    assert
      .dom("tbody tr:nth-child(2)")
      .hasAttribute("id", this.order[1].node.id);
    assert
      .dom("tbody tr:nth-child(3)")
      .hasAttribute("id", this.order[0].node.id);
  });
});
