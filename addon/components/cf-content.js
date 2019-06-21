import Component from "@ember/component";
import layout from "../templates/components/cf-content";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { ComponentQueryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import Document from "ember-caluma/lib/document";
import Navigation from "ember-caluma/lib/navigation";

import getDocumentAnswersQuery from "ember-caluma/gql/queries/get-document-answers";
import getDocumentFormsQuery from "ember-caluma/gql/queries/get-document-forms";
import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";

const parseForm = rootForm => {
  Object.assign(rootForm, {
    questions: rootForm.questions.edges.map(({ node }) => node)
  });

  return [
    rootForm,
    ...rootForm.questions.reduce((subForms, question) => {
      return [
        ...subForms,
        ...(question.subForm ? parseForm(question.subForm) : [])
      ];
    }, [])
  ];
};

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
export default Component.extend(ComponentQueryManager, {
  layout,

  router: service(),

  init() {
    this._super(...arguments);

    assert(
      "A `documentId` must be passed to `{{cf-content}}`",
      this.documentId
    );
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
  document: reads("data.lastSuccessful.value"),

  navigation: computed("document", function() {
    if (!this.document) return;

    return Navigation.create(getOwner(this).ownerInjection(), {
      document: this.document
    });
  }),

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
    if (!this.documentId) return;

    const [{ node: document }] = yield this.apollo.query(
      {
        query: getDocumentAnswersQuery,
        networkPolicy: "network-only",
        variables: { id: this.documentId }
      },
      "allDocuments.edges"
    );

    const [
      {
        node: { form }
      }
    ] = yield this.apollo.query(
      {
        query: getDocumentFormsQuery,
        networkPolicy: "cache-first",
        variables: { id: this.documentId }
      },
      "allDocuments.edges"
    );

    return Document.create(getOwner(this).ownerInjection(), {
      raw: {
        ...document,
        answers: document.answers.edges.map(({ node }) => node),
        forms: parseForm(form)
      }
    });
  })
});
