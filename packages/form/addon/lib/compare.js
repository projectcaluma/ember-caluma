import { isEmpty } from "@ember/utils";
import isEqual from "lodash.isequal";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

/**
 * Serializes a value into a comparable format, ignoring
 * falsey differences.
 *
 * @param {*} v
 * @returns {*}
 */
export function comparisonValue(v) {
  // ignore falsey differences.
  if (isEmpty(v)) {
    return null;
  }

  // compare arrays as sorted serialized strings.
  if (Array.isArray(v)) {
    return v.slice().map(comparisonValue).sort().toString();
  }

  return v;
}

/**
 * Filters a table answer to a comparable format, dropping all
 * non-relevant fields for comparison.
 *
 * @param {*} answer
 * @returns {Object|null}
 */
export function filterTableAnswer(answer) {
  const v = { ...answer.node };
  if (isEmpty(v)) {
    return null;
  }

  // drop question object, but keep the slug for comparison.
  v.questionSlug = v.question?.slug ?? "";

  // drop all non-relevant fields for value comparison.
  delete v.__typename;
  delete v.historyDate;
  delete v.historyType;
  delete v.historyUserId;
  delete v.question;
  delete v.id;
  delete v.documentId;

  // flatten all remaining keys as comparable values.
  for (const key of Object.keys(v)) {
    v[key] = comparisonValue(v[key]);
  }

  return v;
}

/**
 * Creates an object that is suitable for comparison, filtering out
 * non-relevant fields and sorting answers by question slug.
 *
 * @param {Object} doc
 * @returns {Object}
 */
export function comparableDocument(doc) {
  return {
    id: doc.id,
    answers: {
      edges: doc.answers.edges
        .map((answer) => ({
          node: filterTableAnswer(answer),
        }))
        .sort((a, b) => {
          return a.node.questionSlug.localeCompare(b.node.questionSlug);
        }),
    },
  };
}

/**
 * Compares two table documents for equality.
 *
 * @param {Object} docA
 * @param {Object} docB
 * @returns {Boolean}
 */
export function compareTableDocument(docA, docB) {
  return isEqual(comparableDocument(docA), comparableDocument(docB));
}

/**
 * Compares current and historical table values, returning
 * a list of documents with correct history types for diffing.
 *
 * @param {*} owner
 * @param {*} field
 * @param {*} value
 * @param {*} historicalValue
 * @returns a set of documents for comparison
 */
export function historicalTableValue(owner, field, value, historicalValue) {
  const Document = owner.factoryFor("caluma-model:document").class;

  return (
    value
      .map((document) => {
        let historyType = document.historyType;

        // find corresponding historical document to compare.
        const historicalDocument = historicalValue?.find(
          (histDoc) => histDoc.id === document.id,
        );

        // if the document is marked as removed and there is no historical counterpart,
        // we skip it from the diff view. (the original document does not
        // include documents that were removed before the historical snapshot).
        if (historyType === "-" && !historicalDocument) {
          return false;
        }

        if (historyType === "~") {
          if (!historicalDocument) {
            // If a document is marked as modified, but has no historical counterpart,
            // it means it was added as a new document in the current set.
            // If there is another document in the historical set with identical
            // flat table values, we treat this as an unchanged document.
            // (when re-added the same with a different id)
            historyType = historicalValue?.find(
              (histDoc) =>
                decodeId(histDoc.id) !== decodeId(document.id) &&
                compareTableDocument(histDoc, document),
            )
              ? "="
              : "+";
          } else if (compareTableDocument(document, historicalDocument)) {
            // If the modified document has identical flat table values
            // to the historical document, we treat it as identical.
            historyType = "=";
          }
        }

        return new Document({
          raw: parseDocument({
            ...document,
            historicalAnswers: historicalDocument?.answers,
            historyType,
          }),
          parentDocument: field.document,
          historicalDocument: historicalDocument
            ? parseDocument(historicalDocument)
            : undefined,
          owner,
        });
      })
      // filter out dropped documents;
      .filter(Boolean)
  );
}
