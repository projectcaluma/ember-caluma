import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { SlugUniquenessValidator } from "@projectcaluma/ember-form-builder/validators/slug";
import { setupTest } from "dummy/tests/helpers";

module("Unit | Validator | slug", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("it validates uniqueness of form slugs", async function (assert) {
    const validator = new SlugUniquenessValidator("form");

    this.server.post("/graphql", { data: { allForms: { totalCount: 1 } } });

    // count is 1 -> invalid
    assert.strictEqual(
      await validator.validate(null, "slug", null, null, { id: undefined }),
      "t:caluma.form-builder.validations.form.slug:()"
    );

    // id is given -> valid
    assert.true(
      await validator.validate(null, "slug", null, null, { id: "x" })
    );

    this.server.post("/graphql", { data: { allForms: { totalCount: 0 } } });

    // count is 0 -> valid
    assert.true(
      await validator.validate(null, "slug-new", null, null, {
        id: undefined,
      })
    );
  });

  test("it validates uniqueness of question slugs", async function (assert) {
    const validator = new SlugUniquenessValidator("question");

    this.server.post("/graphql", { data: { allQuestions: { totalCount: 1 } } });

    // count is 1 -> invalid
    assert.strictEqual(
      await validator.validate(null, "slug", null, null, { id: undefined }),
      "t:caluma.form-builder.validations.question.slug:()"
    );

    // id is given -> valid
    assert.true(
      await validator.validate(null, "slug", null, null, { id: "x" })
    );

    this.server.post("/graphql", { data: { allQuestions: { totalCount: 0 } } });

    // count is 0 -> valid
    assert.true(
      await validator.validate(null, "slug-new", null, null, {
        id: undefined,
      })
    );
  });

  test("it validates uniqueness of option slugs", async function (assert) {
    const validator = new SlugUniquenessValidator("option");

    this.server.post("/graphql", {
      data: {
        allQuestions: {
          edges: [
            {
              node: {
                id: btoa("Question:d663ed84-e8f4-4b58-ae77-775db34e39b8"),
                options: { totalCount: 1 },
                __typename: "ChoiceQuestion",
              },
            },
          ],
        },
      },
    });

    // count is 1 -> invalid
    assert.strictEqual(
      await validator.validate(null, "slug", null, null, {
        id: undefined,
        question: "question-slug",
      }),
      "t:caluma.form-builder.validations.option.slug:()"
    );

    // id is given -> valid
    assert.true(
      await validator.validate(null, "slug", null, null, {
        id: "x",
        question: "question-slug",
      })
    );

    this.server.post("/graphql", {
      data: {
        allQuestions: {
          edges: [
            {
              node: {
                id: btoa("Question:d663ed84-e8f4-4b58-ae77-775db34e39b8"),
                options: { totalCount: 0 },
                __typename: "ChoiceQuestion",
              },
            },
          ],
        },
      },
    });

    // count is 0 -> valid
    assert.true(
      await validator.validate(null, "slug-new", null, null, {
        id: undefined,
        question: "question-slug",
      })
    );
  });
});
