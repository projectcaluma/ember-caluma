import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency-decorators";

import getDocumentAnswersQuery from "ember-caluma/gql/queries/get-document-answers.graphql";
import getDocumentFormsQuery from "ember-caluma/gql/queries/get-document-forms.graphql";
import { parseDocument } from "ember-caluma/lib/parsers";

/**
 * Component to render a form with navigation.
 *
 * This component can either be used the default way:
 * ```hbs
 * <CfContent @documentId="some-id" />
 * ```
 * Or it can be customized
 * ```hbs
 * <CfContent @documentId="some-id" as |content|}}
 *   <div uk-grid>
 *     <div class="uk-width-1-2"><content.navigation /></div>
 *     <div class="uk-width-1-2">
 *       <content.form />
 *       <hr>
 *       <content.pagination />
 *     </div>
 *   </div>
 * </CfContent>
 * ```
 *
 * If you're rendering multi-page forms, the component also expects a query
 * param `displayedForm`:
 * ```js
 * export default class FormController extends Controller {
 *   queryParams = ["displayedForm"];
 *   @tracked displayedForm;
 *   ...
 * ```
 *
 * @class CfContentComponent
 * @yield {Object} content
 * @yield {Document} content.document
 * @yield {CfFormComponent} content.form
 * @yield {CfNavigationComponent} content.navigation
 * @yield {CfPaginationComponent} content.pagination
 */
export default class CfContentComponent extends Component {
  @service router;
  @service calumaStore;

  @queryManager apollo;

  /**
   * The uuid of the document to display
   *
   * @argument {String} documentId
   */

  /**
   * Can be used to pass "context" information from the outside through
   * to custom overrides.
   *
   * @argument {*} context
   */

  /**
   * Whether the form renders in disabled state
   *
   * @argument {Boolean} disabled
   */

  /**
   * The document to display
   *
   * @property {Document} document
   */
  get document() {
    return this.fetchData.lastSuccessful?.value.document;
  }

  get navigation() {
    return this.fetchData.lastSuccessful?.value.navigation;
  }

  /**
   * The currently displayed fieldset
   *
   * @property {Fieldset} fieldset
   */
  get fieldset() {
    if (!this.document) return null;

    const slug =
      this.router.currentRoute?.queryParams.displayedForm ||
      this.document?.raw.form.slug;

    const fieldset = this.document.fieldsets.find(
      (fieldset) => fieldset.form.slug === slug
    );

    assert(
      `The fieldset \`${slug}\` does not exist in this document`,
      fieldset
    );

    return fieldset;
  }

  @dropTask
  *fetchData() {
    this.teardown();

    if (!this.args.documentId) return;

    const [answerDocument] = (yield this.apollo.query(
      {
        query: getDocumentAnswersQuery,
        fetchPolicy: "network-only",
        variables: { id: this.args.documentId },
      },
      "allDocuments.edges"
    )).map(({ node }) => node);

    const [form] = (yield this.apollo.query(
      {
        query: getDocumentFormsQuery,
        fetchPolicy: "cache-first",
        variables: { slug: answerDocument.form.slug },
      },
      "allForms.edges"
    )).map(({ node }) => node);

    const document = getOwner(this)
      .factoryFor("caluma-model:document")
      .create({ raw: parseDocument({ ...answerDocument, form }) });

    const navigation = getOwner(this)
      .factoryFor("caluma-model:navigation")
      .create({ document });

    return { document, navigation };
  }

  @action
  teardown() {
    if (this.document) this.document.destroy();
    if (this.navigation) this.navigation.destroy();
  }
}
