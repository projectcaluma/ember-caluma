import EmberObject from "@ember/object";
import { module, skip } from "qunit";

import NavigationRouteMixin from "ember-caluma/mixins/navigation-route";

module("Unit | Mixin | navigation-route", function () {
  skip("it works", function (assert) {
    assert.expect(7);

    const NavigationRouteObject = EmberObject.extend(NavigationRouteMixin);
    const subject = NavigationRouteObject.create({
      title: "title",
      routeName: "test",
      paramsFor: () => ({ id: 1 }),
      navigation: {
        pushEntry: (_, { title, link }) => {
          assert.equal(title, "title");
          assert.deepEqual(link, ["test", 1]);
          assert.step("push");
        },
        replaceEntry: (_, { title }) => {
          assert.equal(title, "othertitle");
          assert.step("replace");
        },
        removeEntry: () => assert.step("remove"),
      },
    });

    subject.activate();
    subject.set("title", "othertitle");
    subject.deactivate();

    assert.verifySteps(["push", "replace", "remove"]);
  });
});
