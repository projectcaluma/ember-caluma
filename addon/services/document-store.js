import Service from "@ember/service";
import { computed } from "@ember/object";
import { getOwner } from "@ember/application";
import Document from "ember-caluma/lib/document";
import { atob } from "ember-caluma/helpers/atob";

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
  documents: computed(() => []).readOnly(),

  /**
   * Find a document in the cache or build it and put it in the cache.
   *
   * @method find
   * @param {Object} document The raw document
   * @return {Document} The document
   */
  find(document) {
    const cached = this.documents.find(doc => doc.id === atob(document.id));

    if (!cached) {
      this.documents.push(this._build(document));

      return this.find(document);
    }

    return cached;
  },

  /**
   * Build a new document out of the raw GraphQL document response
   *
   * @method _build
   * @param {Object} document The raw document
   * @return {Document} The built document
   * @internal
   */
  _build(document) {
    return Document.create(getOwner(this).ownerInjection(), {
      raw: document
    });
  }
});
