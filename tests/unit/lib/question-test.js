import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Document from "ember-caluma/lib/document";
import { settled } from "@ember/test-helpers";

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
                slug: "question-1",
                label: "Test",
                isRequired: "true",
                isHidden: "false",
                __typename: "TextQuestion"
              }
            },
            {
              node: {
                slug: "question-2",
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
    document.fields.forEach((field, i) => {
      this.set(`question${i + 1}`, field.question);
    });
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
      "'question-1'|answer > 9000 && 'question-3'|doesntexist == 'blubb'"
    );
    assert.expect(1);
    assert.deepEqual(this.question2.dependsOn, ["question-1"]);
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
      "'question-1'|answer > 9000 && 'question-1'|answer < 10000"
    );
    assert.expect(1);
    assert.deepEqual(this.question2.dependsOn, ["question-1"]);
    this.set("question2.isHidden", "false");
  });

  test("it computes isHidden", async function(assert) {
    assert.expect(5);

    let counter = 0;
    const handler = () => counter++;
    this.question1.document.on("hiddenChanged", handler);

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

    this.question1.document.off("hiddenChanged", handler);
  });
});
