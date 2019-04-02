import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Service | document-store", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.document = {
      id: btoa("Document:1"),
      answers: {
        edges: [
          {
            node: {
              stringValue: "Test",
              question: {
                slug: "question-1"
              },
              __typename: "StringAnswer"
            }
          }
        ]
      },
      form: {
        questions: {
          edges: [
            {
              node: {
                slug: "question-1",
                label: "Question 1",
                isHidden: "false",
                isRequired: "false",
                __typename: "TextQuestion"
              }
            }
          ]
        }
      }
    };
  });

  test("can find a document", function(assert) {
    assert.expect(5);

    const service = this.owner.lookup("service:document-store");

    assert.equal(Object.keys(service.documents), 0);
    assert.ok(service.find(this.document)); // uncached
    assert.equal(Object.keys(service.documents), 1);

    service._build = () => assert.ok(false); // make sure _build is not called
    assert.ok(service.find(this.document)); // cached
    assert.equal(Object.keys(service.documents), 1);
  });

  test("can build a document", function(assert) {
    assert.expect(3);

    const service = this.owner.lookup("service:document-store");

    const document = service.find(this.document);

    assert.ok(document);
    assert.equal(document.id, "1");
    assert.equal(document.fields.length, 1);
  });

  test("can override document in cache", function(assert) {
    const service = this.owner.lookup("service:document-store");

    const document = service.find(this.document);
    assert.ok(document);

    this.document.answers.edges[0].node.stringValue = "Something else!";
    const changedDocument = service.save(this.document);

    assert.equal(
      changedDocument.fields[0].answer.stringValue,
      "Something else!"
    );
    assert.equal(Object.keys(service.documents), 1);
  });
});
