import { getAST, getTransforms } from "ember-caluma/utils/jexl";
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

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
});
