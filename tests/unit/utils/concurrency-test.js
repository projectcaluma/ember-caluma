import { lastValue } from "ember-caluma-form-builder/utils/concurrency";
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import EmberObject from "@ember/object";
import { task } from "ember-concurrency";

module("Unit | Utility | concurrency", function(hooks) {
  setupTest(hooks);

  test("lastValue returns last successful value of task", async function(assert) {
    assert.expect(2);
    const Obj = EmberObject.extend({
      fooTask: task(function*() {
        return yield true;
      }),
      foo: lastValue("fooTask")
    });

    const inst = Obj.create();

    assert.equal(inst.foo, undefined);
    await inst.fooTask.perform();
    assert.equal(inst.foo, true);
  });
});
