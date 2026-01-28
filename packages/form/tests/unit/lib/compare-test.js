import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { rawHistoricalDocumentWithCase } from "./data";

import { compareTableDocument } from "@projectcaluma/ember-form/lib/compare";
import { setupTest } from "dummy/tests/helpers";

module("Unit | Library | compare", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  /**
   * Clones an object by serializing and deserializing it, to prevent
   * mutations during tests.
   *
   * @param {Object} obj
   * @returns {Object}
   */
  const cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  test("compares table answers as flattened objects", async function (assert) {
    assert.expect(8);

    const tableAnswersBefore = cloneObject(
      rawHistoricalDocumentWithCase.answers,
    ).edges.find(({ node }) => node.question.slug === "table").node.tableValue;
    const tableAnswersHistorical = cloneObject(
      rawHistoricalDocumentWithCase.historicalAnswers,
    ).edges.find(({ node }) => node.question.slug === "table").node.tableValue;

    let tableAnswersAfter = cloneObject(tableAnswersHistorical);
    assert.ok(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0]),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1]),
    );

    // modify any ignored table value keys has no effect on comparison.
    tableAnswersAfter = cloneObject(tableAnswersHistorical);
    tableAnswersAfter.forEach((doc) => {
      doc.answers.edges.forEach((edge) => {
        edge.node.historyType = "x";
        edge.node.question.test = "modified";
        edge.node.documentId = "modified";
        edge.node.id = "modified";

        // null or empty string values are treated as equal.
        if (edge.node.stringValue === "") {
          edge.node.stringValue = null;
        }

        // re-add the typename to simulate an order change in the object keys.
        // this will be ignored in the comparison.
        const stringValue = edge.node.stringValue;
        delete edge.node.stringValue;
        edge.node.stringValue = stringValue;
      });
    });
    assert.ok(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0]),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1]),
    );

    // ordering of table answers does not affect the comparison.
    tableAnswersAfter = cloneObject(tableAnswersHistorical);
    tableAnswersAfter[0].answers.edges = [
      tableAnswersAfter[0].answers.edges[1],
      tableAnswersAfter[0].answers.edges[0],
    ];
    tableAnswersAfter[1].answers.edges = [
      tableAnswersAfter[1].answers.edges[1],
      tableAnswersAfter[1].answers.edges[0],
    ];
    assert.ok(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0]),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1]),
    );

    // modify values to add " changed" to each table value answer.
    // and update the historyType and historyDate to simulate changes.
    tableAnswersAfter = cloneObject(tableAnswersHistorical);
    tableAnswersAfter.forEach((doc) => {
      doc.answers.edges.forEach((edge) => {
        edge.node.stringValue += " changed";
        edge.node.historyType = "~";
        edge.node.historyDate = new Date().toISOString();
      });
    });
    // table values after modification don't match anymore.
    assert.notOk(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0]),
    );
    assert.notOk(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1]),
    );
  });
});
