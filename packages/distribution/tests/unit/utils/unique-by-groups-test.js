import { module, test } from "qunit";

import uniqueByGroups from "@projectcaluma/ember-distribution/utils/unique-by-groups";

module("Unit | Utility | unique-by-groups", function () {
  test("it works", function (assert) {
    const rawInquiries = [
      {
        id: 2,
        addressedGroups: [1],
        controllingGroups: [2],
      },
      {
        id: 1,
        addressedGroups: [1],
        controllingGroups: [2],
      },
    ];

    assert.deepEqual(uniqueByGroups(rawInquiries), [rawInquiries[0]]);
  });
});
