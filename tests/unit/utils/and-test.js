/**
 * Copied and updated from nucleartide/ember-changeset-hofs
 */
import and from "dummy/utils/and";
import { module, test } from "qunit";
import { Promise, resolve } from "rsvp";
import { later } from "@ember/runloop";

export function resolveAfter(ms) {
  return new Promise((resolve, reject) => {
    try {
      later(resolve, true, ms);
    } catch (err) {
      reject(err);
    }
  });
}

export function rejectAfter(ms, errorMessage) {
  return new Promise((resolve, reject) => {
    try {
      // resolve with a string throws an error for ember-changeset-validations
      later(resolve, errorMessage, ms);
    } catch (err) {
      reject(err);
    }
  });
}

module("Unit | Utility | and", function () {
  module("sync validators", function () {
    test("should work with an argument list", function (assert) {
      const testCases = [
        {
          validators: [() => true, () => "this is an error message"],
          expected: "this is an error message",
        },
        {
          validators: [() => true, () => false],
          expected: false,
        },
        {
          validators: [() => true, () => true],
          expected: true,
        },
      ];

      for (const { validators, expected } of testCases) {
        const validationFn = and(...validators);
        assert.equal(validationFn(), expected);
      }
    });

    test("should short-circuit", function (assert) {
      const didExecute = [false, false, false];
      const validators = [
        () => (didExecute[0] = true),
        () => false,
        () => {
          throw new Error("This validator should not be reached.");
        },
      ];
      const validationFn = and(...validators);
      validationFn();
      assert.deepEqual(didExecute, [true, false, false]);
    });

    test("should work with arbitrary nesting", function (assert) {
      {
        const validators1 = [
          () => "first error",
          () => "second error",
          () => "third error",
        ];

        const validators2 = [
          () => "fourth error",
          () => "fifth error",
          () => "sixth error",
        ];

        const validators3 = [
          () => "seventh error",
          () => "eighth error",
          () => "ninth error",
        ];

        const validationFn = and(
          and(and(...validators1), and(...validators2)),
          and(...validators3)
        );

        assert.equal(validationFn(), "first error");
      }

      {
        const validators1 = [() => true, () => true, () => true];

        const validators2 = [() => true, () => "leeroy jenkins", () => true];

        const validators3 = [() => true, () => true, () => true];

        const validationFn = and(
          and(and(...validators1), and(...validators2)),
          and(...validators3)
        );

        assert.equal(validationFn(), "leeroy jenkins");
      }
    });
  });

  module("asnyc validators", function () {
    test("should work with an argument list", async function (assert) {
      const testCases = [
        {
          validators: [
            () => resolveAfter(1),
            () => resolveAfter(2),
            () => resolveAfter(3),
          ],
          expected: true,
        },
        {
          validators: [
            () => resolveAfter(1),
            () => true,
            () => resolveAfter(3),
          ],
          expected: true,
        },
        {
          validators: [
            () => resolveAfter(1),
            () => true,
            () => rejectAfter(3, "rip"),
          ],
          expected: "rip",
        },
      ];

      for (const { validators, expected } of testCases) {
        const validationFn = and(...validators);
        const result = await validationFn();
        assert.equal(result, expected);
      }
    });

    test("should short-circuit", async function (assert) {
      const didExecute = [false, false, false];
      const validators = [
        () => resolveAfter(1).then(() => (didExecute[0] = true)),
        () => resolveAfter(1).then(() => false),
        () =>
          resolveAfter(1).then(() => {
            throw new Error("This validator should not be reached.");
          }),
      ];
      const validationFn = and(...validators);
      await validationFn();
      assert.deepEqual(didExecute, [true, false, false]);
    });

    test("should work with arbitrary nesting", async function (assert) {
      {
        const validators1 = [
          () => resolve("first error"),
          () => resolve("second error"),
          () => resolve("third error"),
        ];

        const validators2 = [
          () => resolve("fourth error"),
          () => resolve("fifth error"),
          () => resolve("sixth error"),
        ];

        const validators3 = [
          () => resolve("seventh error"),
          () => resolve("eighth error"),
          () => resolve("ninth error"),
        ];

        const validationFn = and(
          and(and(...validators1), and(...validators2)),
          and(...validators3)
        );

        assert.equal(await validationFn(), "first error");
      }

      {
        const validators1 = [
          () => resolve(true),
          () => resolve(true),
          () => resolve(true),
        ];

        const validators2 = [
          () => resolve(true),
          () => resolve("leeroy jenkins"),
          () => resolve(true),
        ];

        const validators3 = [
          () => resolve(true),
          () => resolve(true),
          () => resolve(true),
        ];

        const validationFn = and(
          and(and(...validators1), and(...validators2)),
          and(...validators3)
        );

        assert.equal(await validationFn(), "leeroy jenkins");
      }
    });

    test("should pass arguments to validators", function (assert) {
      {
        const validators = [
          (key, newValue, oldValue, changes, object) => [
            key,
            newValue,
            oldValue,
            changes,
            object,
          ],
          () => true,
          () => true,
        ];

        const validationFn = and(...validators);
        assert.deepEqual(validationFn(1, 2, 3, 4, 5), [1, 2, 3, 4, 5]);
      }

      {
        const validators = [
          () => true,
          (key, newValue, oldValue, changes, object) => [
            key,
            newValue,
            oldValue,
            changes,
            object,
          ],
          () => true,
        ];

        const validationFn = and(...validators);
        assert.deepEqual(validationFn(1, 2, 3, 4, 5), [1, 2, 3, 4, 5]);
      }
    });
  });
});
