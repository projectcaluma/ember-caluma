import { getAST, getTransforms } from "ember-caluma/utils/jexl";
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import jexl from "jexl";
import { intersects } from "ember-caluma/utils/jexl";

module("Unit | Utility | jexl", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.customJexl = new jexl.Jexl();
    this.customJexl.addBinaryOp("intersects", 20, intersects);
    this.customJexl.addTransform("bar", () => {});
    this.customJexl.addTransform("y", () => {});
  });

  test("AST parsing works", async function (assert) {
    assert.expect(1);

    const jexlExpression = "'foo'|bar > 'baz'";
    assert.deepEqual(getAST(this.customJexl, jexlExpression), {
      left: {
        name: "bar",
        args: [
          {
            type: "Literal",
            value: "foo",
          },
        ],
        pool: "transforms",
        type: "FunctionCall",
      },
      operator: ">",
      right: {
        type: "Literal",
        value: "baz",
      },
      type: "BinaryExpression",
    });
  });

  test("getTransforms works", async function (assert) {
    assert.expect(1);

    assert.deepEqual(
      getTransforms(
        getAST(this.customJexl, "'foo'|bar > 'baz' && 'x'|y > 9000")
      ),
      [
        {
          name: "bar",
          args: [
            {
              type: "Literal",
              value: "foo",
            },
          ],
        },
        {
          name: "y",
          args: [
            {
              type: "Literal",
              value: "x",
            },
          ],
        },
      ]
    );
  });

  test("custom intersects operator works", async function (assert) {
    assert.expect(1);

    assert.deepEqual(getAST(this.customJexl, "[1] intersects [1]"), {
      left: {
        type: "ArrayLiteral",
        value: [
          {
            type: "Literal",
            value: 1,
          },
        ],
      },
      operator: "intersects",
      right: {
        type: "ArrayLiteral",
        value: [
          {
            type: "Literal",
            value: 1,
          },
        ],
      },
      type: "BinaryExpression",
    });
  });
});
