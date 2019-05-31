import Component from "@ember/component";
import layout from "../templates/components/cf-content";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { ComponentQueryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";

import getNavigationDocumentsQuery from "ember-caluma/gql/queries/get-navigation-documents";
import getNavigationFormsQuery from "ember-caluma/gql/queries/get-navigation-forms";

const buildTree = (rootDocument, documents, forms) => {
  if (rootDocument.__typename === "Document") {
    rootDocument.form = forms.find(
      form => form.slug === rootDocument.form.slug
    );
  }

  rootDocument.answers.edges.forEach(answer => {
    if (answer.node.__typename === "FormAnswer") {
      answer.node.formValue = buildTree(
        documents.find(doc => doc.form.slug === answer.node.question.slug),
        documents,
        forms
      );
    }
  });

  return rootDocument;
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
 *     <div class="uk-width-1-2">{{content.form}}</div>
 *   </div>
 * {{/cf-content}}
 * ```
 *
 * @class CfContentComponent
 */
export default Component.extend(ComponentQueryManager, {
  layout,

  documentStore: service(),
  router: service(),

  /**
   * The ID of the nested document to display the navigation for
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
   * Form slug of currently visible section
   *
   * @argument {String} section
   * @readonly
   */
  section: reads("router.currentRoute.queryParams.section"),

  /**
   * Form slug of currently visible sub-section
   *
   * @argument {String} subSection
   * @readonly
   */
  subSection: reads("router.currentRoute.queryParams.subSection"),

  /**
   * Whether the form renders in disabled state
   *
   * @argument {Boolean} disabled
   */
  disabled: false,

  data: computed("documentId", function() {
    const task = this.get("dataTask");

    task.perform();

    return task;
  }),

  dataTask: task(function*() {
    if (!this.documentId) return null;

    const rootId = window.btoa(`Document:${this.documentId}`);

    const documents = (yield this.apollo.query(
      {
        query: getNavigationDocumentsQuery,
        variables: { rootDocument: rootId },
        fetchPolicy: "network-only",
        context: { headers: this.get("context.headers") }
      },
      "allDocuments.edges"
    )).map(({ node }) => node);

    const forms = (yield this.apollo.query(
      {
        query: getNavigationFormsQuery,
        variables: {
          slugs: documents.map(doc => doc.form.slug).sort()
        },
        fetchPolicy: "cache-first",
        context: { headers: this.get("context.headers") }
      },
      "allForms.edges"
    )).map(({ node }) => node);

    return buildTree(
      documents.find(doc => doc.id === rootId),
      documents,
      forms
    );
  }),

  rootDocument: computed("data.lastSuccessful.value", function() {
    return (
      this.get("data.lastSuccessful.value") &&
      this.documentStore.find(this.get("data.lastSuccessful.value"))
    );
  }),

  displayedDocument: computed(
    "section",
    "subSection",
    "rootDocument",
    function() {
      try {
        if (!this.get("rootDocument")) {
          return null;
        }
        if (!this.get("section")) {
          return this.get("rootDocument");
        }
        const section = this.get("rootDocument.fields").find(
          field => field.question.slug === this.get("section")
        );

        if (!this.get("subSection")) {
          return section.childDocument;
        }
        return section.childDocument.fields.find(
          field => field.question.slug === this.get("subSection")
        ).childDocument;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return null;
      } finally {
        window.scrollTo(0, 0);
      }
    }
  )
});
