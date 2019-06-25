import Component from "@ember/component";
import layout from "../templates/components/cf-content";
import { inject as service } from "@ember/service";
import { computed, observer } from "@ember/object";
import { reads, filterBy } from "@ember/object/computed";
import { ComponentQueryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { later, once } from "@ember/runloop";

import getNavigationDocumentsQuery from "ember-caluma/gql/queries/get-navigation-documents";
import getNavigationFormsQuery from "ember-caluma/gql/queries/get-navigation-forms";
import { assert } from "@ember/debug";

const isDisplayableDocument = doc =>
  doc &&
  doc.visibleFields.length &&
  !doc.visibleFields.every(field => field.questionType === "FormQuestion");

const buildParams = (section, subSections) => {
  if (!section) {
    return [];
  }

  return [
    { section: section.question.slug, subSection: undefined },
    ...subSections.map(s => ({
      section: section.question.slug,
      subSection: s.question.slug
    }))
  ];
};

const buildTree = (rootDocument, documents, forms) => {
  if (rootDocument.__typename === "Document") {
    rootDocument.form = forms.find(
      form => form.slug === rootDocument.form.slug
    );
  }

  rootDocument.answers.edges.forEach(answer => {
    if (answer.node.__typename === "FormAnswer") {
      const childDocument = documents.find(
        doc => doc.form.slug === answer.node.question.subForm.slug
      );

      assert(
        `Document for form "${answer.node.question.subForm.slug}" not found`,
        childDocument
      );

      answer.node.formValue = buildTree(childDocument, documents, forms);
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
        fetchPolicy: "network-only"
      },
      "allDocuments.edges"
    )).map(({ node }) => node);

    const forms = (yield this.apollo.query(
      {
        query: getNavigationFormsQuery,
        variables: {
          slugs: documents.map(doc => doc.form.slug).sort()
        },
        fetchPolicy: "cache-first"
      },
      "allForms.edges"
    )).map(({ node }) => node);

    return this.documentStore.find(
      buildTree(documents.find(doc => doc.id === rootId), documents, forms)
    );
  }),

  rootDocument: reads("data.lastSuccessful.value"),

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
      }
    }
  ),

  _sections: filterBy(
    "rootDocument.visibleFields",
    "visibleInNavigation",
    true
  ),

  _currentSection: computed("_sections.[]", "section", function() {
    return this._sections.find(s => s.question.slug === this.section);
  }),

  _currentSubSection: computed(
    "_currentSubSections.[]",
    "subSection",
    function() {
      return this._currentSubSections.find(
        s => s.question.slug === this.subSection
      );
    }
  ),

  _currentSubSections: filterBy(
    "_currentSection.childDocument.visibleFields",
    "visibleInNavigation",
    true
  ),

  _currentSectionIndex: computed("_sections.[]", "section", function() {
    return this._sections.indexOf(this._currentSection);
  }),

  _previousSection: computed("_currentSectionIndex", function() {
    return this._currentSectionIndex > 0
      ? this._sections[this._currentSectionIndex - 1]
      : null;
  }),

  _nextSection: computed(
    "_currentSectionIndex",
    "_sections.length",
    function() {
      return this._currentSectionIndex < this._sections.length
        ? this._sections[this._currentSectionIndex + 1]
        : null;
    }
  ),

  _previousSubSections: filterBy(
    "_previousSection.childDocument.visibleFields",
    "visibleInNavigation",
    true
  ),

  _nextSubSections: filterBy(
    "_nextSection.childDocument.visibleFields",
    "visibleInNavigation",
    true
  ),

  adjacentSections: computed(
    "_previousSubSections.[]",
    "_currentSubSections.[]",
    "_nextSubSections.[]",
    function() {
      return [
        ...buildParams(this._previousSection, this._previousSubSections),
        ...buildParams(this._currentSection, this._currentSubSections),
        ...buildParams(this._nextSection, this._nextSubSections)
      ];
    }
  ),

  sectionIndex: computed(
    "adjacentSections.[]",
    "section",
    "subSection",
    function() {
      return this.adjacentSections.findIndex(
        s => s.section === this.section && s.subSection === this.subSection
      );
    }
  ),

  previousSection: computed("adjacentSections.[]", "sectionIndex", function() {
    return this.sectionIndex > 0
      ? this.adjacentSections[this.sectionIndex - 1]
      : null;
  }),

  nextSection: computed("adjacentSections.[]", "sectionIndex", function() {
    return this.sectionIndex < this.adjacentSections.length
      ? this.adjacentSections[this.sectionIndex + 1]
      : null;
  }),

  // eslint-disable-next-line ember/no-observers
  _displayedDocumentChanged: observer(
    "displayedDocument",
    "nextSection",
    function() {
      if (isDisplayableDocument(this.displayedDocument) || !this.nextSection) {
        return;
      }

      later(this, () => once(this, "_transitionToNextSection"));
    }
  ),

  _transitionToNextSection() {
    if (isDisplayableDocument(this.displayedDocument) || !this.nextSection) {
      return;
    }

    this.router.replaceWith({ queryParams: this.nextSection }).then(() => {
      this.element.scrollIntoView(true);
    });
  }
});
