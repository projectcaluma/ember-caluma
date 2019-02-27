import { decodeMeta } from "ember-caluma/utils/apollo";
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Utility | apollo", function(hooks) {
  setupTest(hooks);

  test("extracting meta works", async function(assert) {
    assert.expect(1);

    assert.deepEqual(
      decodeMeta([
        { node: null },
        {
          _private: {
            meta: '{"not": "parsed"}'
          },
          node: {
            bar: "bazz",
            meta: '{"metaWorks": true, "nested": {"alsoWorks": 1}}'
          }
        }
      ]),
      [
        { node: null },
        {
          _private: {
            meta: '{"not": "parsed"}'
          },
          node: {
            bar: "bazz",
            meta: { metaWorks: true, nested: { alsoWorks: 1 } }
          }
        }
      ]
    );
  });
});
