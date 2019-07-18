import {
  getAST,
  getTransforms,
  cleanExpression,
  expression
} from "ember-caluma/utils/jexl";
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import EmberObject from "@ember/object";

module("Unit | Utility | jexl", function(hooks) {
  setupTest(hooks);

  test("AST parsing works", async function(assert) {
    assert.expect(1);

    const jexlExpression = "'foo'|bar > 'baz'";
    assert.deepEqual(getAST(jexlExpression), {
      left: {
        args: [],
        name: "bar",
        subject: {
          type: "Literal",
          value: "foo"
        },
        type: "Transform"
      },
      operator: ">",
      right: {
        type: "Literal",
        value: "baz"
      },
      type: "BinaryExpression"
    });
  });

  test("getTransforms works", async function(assert) {
    assert.expect(1);

    assert.deepEqual(
      getTransforms(getAST("'foo'|bar > 'baz' && 'x'|y > 9000")),
      [
        {
          args: [],
          name: "bar",
          subject: {
            type: "Literal",
            value: "foo"
          }
        },
        {
          args: [],
          name: "y",
          subject: {
            type: "Literal",
            value: "x"
          }
        }
      ]
    );
  });

  test("custom intersects operator works", async function(assert) {
    assert.expect(1);

    assert.deepEqual(getAST("[1] intersects [1]"), {
      left: {
        type: "ArrayLiteral",
        value: [
          {
            type: "Literal",
            value: 1
          }
        ]
      },
      operator: "intersects",
      right: {
        type: "ArrayLiteral",
        value: [
          {
            type: "Literal",
            value: 1
          }
        ]
      },
      type: "BinaryExpression"
    });
  });

  test("clean expression and expression computed macro works", async function(assert) {
    assert.expect(2);

    const whitespaced = "(\n  1 == 1\r    &&\r    2 == 2\n)";
    const cleaned = "( 1 == 1 && 2 == 2 )";

    const obj = EmberObject.extend({
      cleaned: expression("whitespaced")
    }).create({ whitespaced });

    assert.equal(cleanExpression(whitespaced), cleaned);
    assert.equal(obj.cleaned, cleaned);
  });
});
