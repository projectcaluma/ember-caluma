import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Document from "ember-caluma/lib/document";
import { settled } from "@ember/test-helpers";
import nestedRaw from "./nested-with-duplicate-slugs";

module("Unit | Library | question", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function() {
    const raw = {
      id: 1,
      answers: {
        edges: []
      },
      form: {
        questions: {
          edges: [
            {
              node: {
                slug: "question1",
                label: "Test",
                isRequired: "true",
                isHidden: "false",
                __typename: "TextQuestion"
              }
            },
            {
              node: {
                slug: "question2",
                label: "Test2",
                isRequired: "true",
                isHidden: "false",
                __typename: "TextQuestion"
              }
            }
          ]
        }
      }
    };

    const document = Document.create(this.owner.ownerInjection(), { raw });
    document.fields.forEach(field => {
      this.set(field.question.slug, field.question);
    });
    this.set(
      "nestedDocument",
      Document.create(this.owner.ownerInjection(), {
        raw: nestedRaw
      })
    );
    await settled();
  });

  test("it computes optional", async function(assert) {
    assert.expect(2);

    assert.equal(await this.question1.optionalTask.perform(), false);

    this.question1.set("isRequired", "false");

    assert.equal(await this.question1.optionalTask.perform(), true);
  });

  test("it computes dependsOn based on 'answer' transform", async function(assert) {
    this.set(
      "question2.isHidden",
      "'question1'|answer > 9000 && 'question3'|doesntexist == 'blubb'"
    );
    assert.expect(2);
    assert.equal(this.question2.dependsOn.length, 1);
    assert.equal(
      this.question2.dependsOn[0].id,
      "Document:1:Question:question1"
    );
    this.set("question2.isHidden", "false");
  });

  test("dependsOn only contains existing questions", async function(assert) {
    this.set("question2.isHidden", "'question-nonexistent'|answer > 9000");
    assert.expect(1);
    assert.throws(
      () => this.question2.dependsOn,
      /Field "question-nonexistent" is not present in this document/
    );
    this.set("question2.isHidden", "false");
  });

  test("dependsOn doesn't contain duplicate entries", async function(assert) {
    this.set(
      "question2.isHidden",
      "'question1'|answer > 9000 && 'question1'|answer < 10000"
    );
    assert.expect(1);
    assert.deepEqual(
      this.question2.dependsOn.map(field => field.question.slug),
      ["question1"]
    );
    this.set("question2.isHidden", "false");
  });

  test("dependsOn determines duplicates by form and question", async function(assert) {
    const ba1 = this.get("nestedDocument").fields[1].childDocument.fields[0]
      .childDocument.fields[0].question;
    ba1.set(
      "isHidden",
      "'a-a-1'|answer('parent.parent.a.a-a') > 9000 && 'a-a-1'|answer('parent.parent.a.a-a') < 10000 && 'a-a-1'|answer('parent.parent.a.a-b')"
    );
    assert.expect(1);
    assert.deepEqual(
      ba1.dependsOn.map(
        field => `${field.document.raw.form.slug} > ${field.question.slug}`
      ),
      ["a-a > a-a-1", "a-b > a-a-1"]
    );
    ba1.set("isHidden", "false");
  });

  test("it computes isHidden", async function(assert) {
    assert.expect(5);

    let counter = 0;
    const handler = () => counter++;
    this.question1.field.on("hiddenChanged", handler);

    this.question1.set("isHidden", "true");
    assert.equal(await this.question1.hiddenTask.perform(), true);
    await settled();
    assert.equal(counter, 1, "initial perform triggers a change");

    await this.question1.hiddenTask.perform();
    await settled();
    assert.equal(
      counter,
      1,
      "performing task again without change should not trigger new event"
    );

    this.question1.set("isHidden", "false");
    assert.equal(await this.question1.hiddenTask.perform(), false);
    await settled();
    assert.equal(
      counter,
      2,
      "after another change two events should be triggered"
    );

    this.question1.field.off("hiddenChanged", handler);
  });
});
