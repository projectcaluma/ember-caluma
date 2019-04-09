import { bfsSearch } from "ember-caluma/utils/tree";
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Utility | tree", function(hooks) {
  setupTest(hooks);

  test("bfs search works", async function(assert) {
    assert.expect(1);

    const tree = {
      name: "foo",
      children: [
        { name: "bar" },
        { name: "baz" },
        { name: "buzz", children: [{ name: "foobar" }] }
      ]
    };
    assert.deepEqual(
      bfsSearch(
        tree,
        node => node.name === "foobar" && node,
        node => node.children
      ),
      { name: "foobar" }
    );
  });
});
