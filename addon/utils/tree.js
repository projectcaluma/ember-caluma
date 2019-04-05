/**
 * Breadth-first search over tree
 *
 * @param {Object} root Root node.
 * @param {Function} searchFn Function that searches a single node
 * @param {Function} getChildren Function that returns children of a given node
 *
 * @return {any} Search result, or false if nothing was found
 */
export function bfsSearch(root, searchFn, getChildren) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    const match = searchFn(node);
    if (match) {
      return match;
    }
    queue.push(...(getChildren(node) || []));
  }
  return false;
}

/**
 * Searches for a field by question slug in a document tree.
 */
export function findFieldInTree(document, slug) {
  const find = (fields, slug) =>
    fields.find(field => field.question.slug === slug);

  let root = document;
  while (root.parentDocument) {
    root = root.parentDocument;
  }
  return (
    // search in own document first
    find(document.fields, slug) ||
    // search whole tree afterwards
    bfsSearch(
      root,
      document => find(document.fields, slug),
      document => document.childDocuments
    )
  );
}
