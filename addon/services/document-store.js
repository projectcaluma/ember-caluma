import Service from "@ember/service";
import { computed } from "@ember/object";
import { getOwner } from "@ember/application";
import Document from "ember-caluma/lib/document";
import { decodeId } from "ember-caluma/helpers/decode-id";

/**
 * @class DocumentStoreService
 * @extends Ember.Service
 */
export default Service.extend({
  /**
   * The actual store of all present documents
   *
   * @property {Document[]} documents
   * @accessor
   */
  documents: computed(() => ({})).readOnly(),

  /**
   * Find a document in the cache or build it and put it in the cache.
   *
   * @method find
   * @param {Object} document The raw document
   * @return {Document} The document
   */
  find(document, { noCache, parentDocument } = {}) {
    const id = decodeId(document.id);
    const cached = this.documents[id];

    if (noCache || !cached) {
      const builtDocument = this._build(document, { parentDocument });
      this.documents[id] = builtDocument;

      return builtDocument;
    }

    return cached;
  },

  /**
   * Save (override) a document in the cache without considering existing cache entries
   * Shorthand for `find(document, { noCache: true })
   *
   * @method save
   * @param {Object} document The raw document
   * @return {Document} The document
   */
  save(document, { parentDocument } = {}) {
    return this.find(document, { parentDocument, noCache: true });
  },

  /**
   * Build a new document out of the raw GraphQL document response
   *
   * @method _build
   * @param {Object} document The raw document
   * @return {Document} The built document
   * @internal
   */
  _build(document, { parentDocument } = {}) {
    return Document.create(getOwner(this).ownerInjection(), {
      raw: document,
      parentDocument
    });
  }
});
