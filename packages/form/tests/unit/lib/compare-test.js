import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { rawHistoricalDocumentWithCase } from "./data";

import {
  compareTableDocument,
  flatTableMap,
} from "@projectcaluma/ember-form/lib/compare";
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
    assert.expect(18);

    // flattened table values stringified.
    // - the question object field is converted to a questionSlug string.
    // - extra fields like historyType, historyDate, ... are ignored.
    // - empty string answer value becomes null.
    const beforeFlat =
      '{"questionSlug":"table-form-question","stringValue":"show-multiple-choice"},{"questionSlug":"table-form-question-2","stringValue":"test"},{"questionSlug":"table-form-question","stringValue":"show-multiple-choice2"},{"questionSlug":"table-form-question-2","stringValue":null}';

    const tableAnswersBefore = cloneObject(
      rawHistoricalDocumentWithCase.answers,
    ).edges.find(({ node }) => node.question.slug === "table").node.tableValue;
    const tableAnswersHistorical = cloneObject(
      rawHistoricalDocumentWithCase.historicalAnswers,
    ).edges.find(({ node }) => node.question.slug === "table").node.tableValue;

    let tableAnswersAfter = cloneObject(tableAnswersHistorical);
    assert.ok(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0], false),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1], false),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0], true),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1], true),
    );
    assert.strictEqual(flatTableMap(tableAnswersBefore), beforeFlat);
    assert.strictEqual(flatTableMap(tableAnswersAfter), beforeFlat);

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
    // flattend table values after modification don't match anymore.
    assert.ok(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0], false),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1], false),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0], true),
    );
    assert.ok(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1], true),
    );
    assert.strictEqual(flatTableMap(tableAnswersBefore), beforeFlat);
    assert.strictEqual(flatTableMap(tableAnswersAfter), beforeFlat);

    // modify values to add " changed" to each table value answer.
    // and update the historyType and historyDate to simulate changes.
    const afterFlat =
      '{"questionSlug":"table-form-question","stringValue":"show-multiple-choice changed"},{"questionSlug":"table-form-question-2","stringValue":"test changed"},{"questionSlug":"table-form-question","stringValue":"show-multiple-choice2 changed"},{"questionSlug":"table-form-question-2","stringValue":" changed"}';

    tableAnswersAfter = cloneObject(tableAnswersHistorical);
    tableAnswersAfter.forEach((doc) => {
      doc.answers.edges.forEach((edge) => {
        edge.node.stringValue += " changed";
        edge.node.historyType = "~";
        edge.node.historyDate = new Date().toISOString();
      });
    });
    // flattend table values after modification don't match anymore.
    assert.notOk(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0], false),
    );
    assert.notOk(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1], false),
    );
    assert.notOk(
      compareTableDocument(tableAnswersBefore[0], tableAnswersAfter[0], true),
    );
    assert.notOk(
      compareTableDocument(tableAnswersBefore[1], tableAnswersAfter[1], true),
    );
    // assert changed values in the after table answers.
    assert.strictEqual(flatTableMap(tableAnswersBefore), beforeFlat);
    assert.strictEqual(flatTableMap(tableAnswersAfter), afterFlat);
  });
});
