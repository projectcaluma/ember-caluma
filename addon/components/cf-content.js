import { getOwner } from "@ember/application";
import Component from "@ember/component";
import { reads } from "@ember/object/computed";
import { assert } from "@ember/debug";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";

import Document from "ember-caluma/lib/document";
import Navigation from "ember-caluma/lib/navigation";
import { parseDocument } from "ember-caluma/lib/parsers";
import layout from "ember-caluma/templates/components/cf-content";
import getDocumentAnswersQuery from "ember-caluma/gql/queries/get-document-answers";
import getDocumentFormsQuery from "ember-caluma/gql/queries/get-document-forms";

/**
 * Component to render a form with navigation.
 *
 * This component can either be used the default way:
 * ```hbs
 * {{cf-content documentId="some-id"}}
 * ```
 * Or it can be customized
 * ```hbs
 * {{#cf-content documentId="some-id" as |content|}}
 *   <div uk-grid>
 *     <div class="uk-width-1-2">{{content.navigation}}</div>
 *     <div class="uk-width-1-2">
 *       {{content.form}}</div>
 *       <hr>
 *       {{content.pagination}}
 *     </div>
 *   </div>
 * {{/cf-content}}
 * ```
 *
 * @class CfContentComponent
 * @yield {Object} content
 * @yield {Document} content.document
 * @yield {CfFormComponent} content.form
 * @yield {CfNavigationComponent} content.navigation
 * @yield {CfPaginationComponent} content.pagination
 */
export default Component.extend({
  layout,

  router: service(),
  calumaStore: service(),

  apollo: queryManager(),

  init() {
    this._super(...arguments);

    assert(
      "A `documentId` must be passed to `{{cf-content}}`",
      this.documentId
    );
  },

  willDestroy() {
    this._super(...arguments);

    this._teardown();
  },

  _teardown() {
    if (this.document) this.document.destroy();
    if (this.navigation) this.navigation.destroy();
  },

  /**
   * The uuid of the document to display
   *
   * @argument {String} documentId
   */
  documentId: null,

  /**
   * Can be used to pass "context" information from the outside through
   * to custom overrides.
   *
   * @argument {*} context
   */
  context: null,

  /**
   * Whether the form renders in disabled state
   *
   * @argument {Boolean} disabled
   */
  disabled: false,

  /**
   * The document to display
   *
   * @property {Document} document
   */
  document: reads("data.lastSuccessful.value.document"),
  navigation: reads("data.lastSuccessful.value.navigation"),

  fieldset: computed(
    "document.{fieldsets.[],raw.form.slug}",
    "router.currentRoute.queryParams.displayedForm",
    function() {
      if (!this.document) return;

      const slug =
        this.get("router.currentRoute.queryParams.displayedForm") ||
        this.get("document.raw.form.slug");

      const fieldset = this.document.fieldsets.find(
        fieldset => fieldset.form.slug === slug
      );

      assert(
        `The fieldset \`${slug}\` does not exist in this document`,
        fieldset
      );

      return fieldset;
    }
  ),

  data: computed("documentId", function() {
    const task = this.get("dataTask");

    task.perform();

    return task;
  }),

  dataTask: task(function*() {
    yield this._teardown();

    if (!this.documentId) return;

    const [answerDocument] = (yield this.apollo.query(
      {
        query: getDocumentAnswersQuery,
        fetchPolicy: "network-only",
        variables: { id: this.documentId }
      },
      "allDocuments.edges"
    )).map(({ node }) => node);

    const [form] = (yield this.apollo.query(
      {
        query: getDocumentFormsQuery,
        fetchPolicy: "cache-first",
        variables: { slug: answerDocument.form.slug }
      },
      "allForms.edges"
    )).map(({ node }) => node);

    const document = Document.create(getOwner(this).ownerInjection(), {
      raw: parseDocument({ ...answerDocument, form })
    });

    return {
      document,
      navigation: Navigation.create(getOwner(this).ownerInjection(), {
        document
      })
    };
  }).drop()
});
