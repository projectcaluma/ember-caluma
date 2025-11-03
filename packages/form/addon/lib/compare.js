import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

/**
 * Transform objects into sorted JSON strings for comparison.
 * If it is an array, serialize each item as object.
 * If it is not an object or array, return the value as is.
 *
 * @param {*} v
 * @returns {*}
 */
export function serializeObject(v) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const sortedKeys = Object.keys(v).sort();
    const sortedObj = {};
    for (const key of sortedKeys) {
      sortedObj[key] = serializeObject(v[key]);
    }
    return JSON.stringify(sortedObj);
  } else if (Array.isArray(v)) {
    return v.map(serializeObject);
  }

  return v;
}

/**
 * Serializes a value into a comparable format, ignoring
 * falsey differences.
 *
 * @param {*} v
 * @returns {*}
 */
export function comparisonValue(v) {
  // ignore falsey differences.
  if ([null, undefined, ""].includes(v)) {
    return null;
  }

  // compare arrays as sorted serialized strings.
  if (Array.isArray(v)) {
    return comparisonValue(
      v.slice().map(comparisonValue).map(serializeObject).sort().toString(),
    );
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
  const v = { ...(answer?.node || {}) };
  if (!v) {
    return null;
  }

  v.questionSlug = v.question?.slug ?? "";

  // drop all non-relevant fields for value comparison.
  delete v.__typename;
  delete v.historyDate;
  delete v.historyType;
  delete v.historyUserId;
  delete v.question;
  delete v.id;
  delete v.documentId;

  return v;
}

/**
 * Creates a flat comparable string representation of the table documents
 * for comparison.
 *
 * @param {Array<Object>} docs
 * @returns {Array<Object>}
 */
export function flatTableMap(docs) {
  // If a single document is passed, wrap it in an array and process it.
  if (!Array.isArray(docs)) {
    return flatTableMap([docs]);
  }

  const mapped = docs.map((doc) =>
    doc?.answers?.edges?.map(filterTableAnswer).sort((a, b) => {
      // sort by question slug if available for an ordered comparison.
      if (
        a?.questionSlug &&
        b?.questionSlug &&
        a.questionSlug !== b.questionSlug
      ) {
        return a.questionSlug.localeCompare(b.questionSlug);
      }

      // fallback to serialized object comparison.
      return serializeObject(a).localeCompare(serializeObject(b));
    }),
  );

  return mapped.map(comparisonValue).toString();
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

  // Any document that was removed before the 'from' date should be dropped
  // from the comparison, because it has no relevance to the current
  // diff view.
  const dropped = value
    .map((document) => {
      if ("-" === document.historyType) {
        const parsedHistoryDate = new Date(Date.parse(document.historyDate));
        if (
          field?.question?.dataSourceContext?.compare?.from &&
          parsedHistoryDate < field?.question?.dataSourceContext?.compare?.from
        ) {
          return decodeId(document.id);
        }
      }
      return false;
    })
    .filter(Boolean);

  return (
    value
      .map((document) => {
        let historyType = document.historyType;
        if (dropped.includes(decodeId(document.id))) {
          return false;
        }

        // find corresponding historical document that is not dropped,
        // to compare against the current document.
        const historicalDocument = historicalValue?.find(
          (histDoc) =>
            !dropped.includes(decodeId(histDoc.id)) &&
            decodeId(histDoc.id) === decodeId(document.id),
        );

        if (historyType === "~") {
          if (!historicalDocument) {
            // If a document is marked as modified, but has no historical counterpart,
            // it means it was added as a new document in the current set.
            // If there is another document in the historical set with identical
            // flat table values, we treat this as an unchanged document.
            // (when re-added the same with a different id)
            historyType = historicalValue?.find(
              (histDoc) =>
                !dropped.includes(decodeId(histDoc.id)) &&
                decodeId(histDoc.id) !== decodeId(document.id) &&
                flatTableMap(histDoc) === flatTableMap(document),
            )
              ? "="
              : "+";
          } else if (
            flatTableMap(document) === flatTableMap(historicalDocument)
          ) {
            // If the modified document has identical flat table values
            // to the historical document, we treat it as identical.
            historyType = "=";
          }
        } else if (historyType === "-") {
          // If a document is marked as deleted, but there is another document
          // in the current set with identical flat table values, we discard it from
          // the diff view (when re-added with different id but the same values, we only
          // show one version).
          if (
            value.find(
              (newDoc) =>
                !dropped.includes(decodeId(newDoc.id)) &&
                decodeId(newDoc.id) !== decodeId(document.id) &&
                flatTableMap(newDoc) === flatTableMap(document),
            )
          ) {
            return false;
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
