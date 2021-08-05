/**
 * Copied and updated from nucleartide/ember-changeset-hofs
 */
import { resolveAfter, rejectAfter } from "dummy/tests/helpers/promise";
import or from "dummy/utils/or";
import { module, test } from "qunit";
import { resolve } from "rsvp";

module("Unit | Utility | or", function () {
  module("sync validators", function () {
    test("should work with an argument list", function (assert) {
      assert.expect(3);

      const testCases = [
        {
          validators: [() => true, () => "this is an error message"],
          expected: true,
        },
        {
          validators: [() => true, () => false],
          expected: true,
        },
        {
          validators: [() => true, () => true],
          expected: true,
        },
      ];

      for (const { validators, expected } of testCases) {
        const validationFn = or(...validators);
        assert.equal(validationFn(), expected);
      }
    });

    test("should short-circuit", function (assert) {
      const didExecute = [false, false, false];
      const validators = [
        () => {
          didExecute[0] = true;
          return false;
        },
        () => true,
        () => {
          throw new Error("This validator should not be reached.");
        },
      ];
      const validationFn = or(...validators);
      validationFn();
      assert.deepEqual(didExecute, [true, false, false]);
    });

    test("should return the last error if all validators return errors", function (assert) {
      const validators = [
        () => "first error",
        () => "second error",
        () => "third error",
      ];

      const validationFn = or(...validators);
      assert.equal(validationFn(), "third error");
    });

    test("should work with arbitrary nesting", function (assert) {
      assert.expect(2);

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

        const validationFn = or(
          or(or(...validators1), or(...validators2)),
          or(...validators3)
        );

        assert.equal(validationFn(), "ninth error");
      }

      {
        const validators1 = [
          () => "first error",
          () => "second error",
          () => "third error",
        ];

        const validators2 = [
          () => "fourth error",
          () => true, // derp
          () => "sixth error",
        ];

        const validators3 = [
          () => "seventh error",
          () => "eighth error",
          () => "ninth error",
        ];

        const validationFn = or(
          or(or(...validators1), or(...validators2)),
          or(...validators3)
        );

        assert.true(validationFn());
      }
    });
  });

  module("async validators", function () {
    test("should work with an argument list", async function (assert) {
      assert.expect(3);

      const testCases = [
        {
          validators: [
            () => rejectAfter(1, "first"),
            () => rejectAfter(2, "second"),
            () => rejectAfter(3, "third"),
          ],
          expected: "third",
        },
        {
          validators: [() => rejectAfter(1), () => true, () => rejectAfter(3)],
          expected: true,
        },
        {
          validators: [() => true, () => resolveAfter(3, "rip")],
          expected: true,
        },
      ];

      await Promise.all(
        testCases.map(async ({ validators, expected }) => {
          const validationFn = or(...validators);
          const result = await validationFn();
          assert.equal(result, expected);
        })
      );
    });

    test("should short-circuit", async function (assert) {
      const didExecute = [false, false, false];
      const validators = [
        () =>
          rejectAfter(1, "first").then(() => {
            didExecute[0] = true;
            return false;
          }),
        () => rejectAfter(1, "second").then(() => true),
        () =>
          rejectAfter(1, "third").then(() => {
            throw new Error("This validator should not be reached.");
          }),
      ];
      const validationFn = or(...validators);
      await validationFn();
      assert.deepEqual(didExecute, [true, false, false]);
    });

    test("should return the last error if all validators return errors", async function (assert) {
      const validators = [
        () => resolve("first error"),
        () => resolve("second error"),
        () => resolve("third error"),
      ];

      const validationFn = or(...validators);
      assert.deepEqual(await validationFn(), "third error");
    });

    test("should work with arbitrary nesting", async function (assert) {
      assert.expect(2);

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

        const validationFn = or(
          or(or(...validators1), or(...validators2)),
          or(...validators3)
        );

        assert.equal(await validationFn(), "ninth error");
      }

      {
        const validators1 = [
          () => resolve("first error"),
          () => resolve("second error"),
          () => resolve("third error"),
        ];

        const validators2 = [
          () => resolve("fourth error"),
          () => resolve(true), // derp
          () => resolve("sixth error"),
        ];

        const validators3 = [
          () => resolve("seventh error"),
          () => resolve("eighth error"),
          () => resolve("ninth error"),
        ];

        const validationFn = or(
          or(or(...validators1), or(...validators2)),
          or(...validators3)
        );

        assert.true(await validationFn());
      }
    });

    test("should pass arguments to validators", function (assert) {
      assert.expect(2);

      {
        const validators = [
          (key, newValue, oldValue, changes, object) => [
            key,
            newValue,
            oldValue,
            changes,
            object,
          ],
        ];

        const validationFn = or(...validators);
        assert.deepEqual(validationFn(1, 2, 3, 4, 5), [1, 2, 3, 4, 5]);
      }

      {
        const validators = [
          () => false,
          (key, newValue, oldValue, changes, object) => [
            key,
            newValue,
            oldValue,
            changes,
            object,
          ],
        ];

        const validationFn = or(...validators);
        assert.deepEqual(validationFn(1, 2, 3, 4, 5), [1, 2, 3, 4, 5]);
      }
    });
  });
});
