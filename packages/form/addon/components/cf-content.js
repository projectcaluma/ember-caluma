import { getOwner } from "@ember/application";
import { destroy, registerDestructor } from "@ember/destroyable";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

import getDocumentAnswersCompareQuery from "@projectcaluma/ember-form/gql/queries/document-answers-compare.graphql";
import getDocumentAnswersQuery from "@projectcaluma/ember-form/gql/queries/document-answers.graphql";
import getDocumentFormsQuery from "@projectcaluma/ember-form/gql/queries/document-forms.graphql";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

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
 * To use this component for a comparison between two document revisions, pass @compare
 *
 * <CfContent @documentId="some-id" @compare={{hash
      from="yyyy-mm-dd"
      to="yyyy-mm-dd"
 * }} />
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
   * @argument {Object} context
   */

  /**
   * Whether the form renders in disabled state
   *
   * @argument {Boolean} disabled
   */

  /**
   * Can be used to pass "compare" context information from the outside.
   * Pass a hash with `from` and optional `to` date to compare documents.
   *
   * @argument {Object} compare
   */

  /**
   * Whether the form should be displayed as loading, this can be used to
   * indicate a loading state if the application calling this component is
   * loading additional data.
   *
   * @argument {Boolean} loading
   */

  /**
   * The document to display
   *
   * @property {Document} document
   */
  get document() {
    return this.data.value?.document;
  }

  /**
   * The navigation to display
   *
   * @property {Document} document
   */
  get navigation() {
    return this.data.value?.navigation;
  }

  /**
   * Whether the component is in a loading state. This can be overwritten by
   * passing `loading` as an argument
   *
   * @property {Boolean} loading
   */
  get loading() {
    return this.args.loading || this.data.isRunning;
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

    return this.document.fieldsets.find(
      (fieldset) => fieldset.form.slug === slug,
    );
  }

  fetchData = task({ drop: true }, async () => {
    if (this.document) destroy(this.document);
    if (this.navigation) destroy(this.navigation);

    if (!this.args.documentId) return;

    const owner = getOwner(this);
    const Document = owner.factoryFor("caluma-model:document").class;
    const Navigation = owner.factoryFor("caluma-model:navigation").class;

    let answerDocument = null;
    let historicalDocument = null;
    let compareContext = null;

    if (!this.args.compare) {
      [answerDocument] = (await this.apollo.query(
        {
          query: getDocumentAnswersQuery,
          fetchPolicy: "network-only",
          variables: { id: this.args.documentId },
        },
        "allDocuments.edges",
      )).map(({ node }) => node);
    } else {
      compareContext = { enabled: true, ...this.args.compare };
      const { from, to } = compareContext;

      function toDate(input) {
        if (input instanceof Date) {
          return new Date(input.getTime());
        }

        return new Date(input);
      }
      const data = await this.apollo.query({
        query: getDocumentAnswersCompareQuery,
        fetchPolicy: "network-only",
        variables: {
          documentId: this.args.documentId,
          from: toDate(from),
          to: toDate(to ?? new Date()),
        },
      });
      historicalDocument = data.fromRevision;
      answerDocument = data.toRevision;
    }

    const [form] = (await this.apollo.query(
      {
        query: getDocumentFormsQuery,
        fetchPolicy: "cache-first",
        variables: { slug: answerDocument.form.slug },
      },
      "allForms.edges",
    )).map(({ node }) => node);

    const raw = parseDocument({ ...answerDocument, form });

    const document = new Document({
      raw,
      owner,
      historicalDocument: historicalDocument
        ? parseDocument({ ...historicalDocument, form })
        : null,
      compare: compareContext,
    });
    const navigation = new Navigation({ document, owner });

    registerDestructor(this, () => {
      destroy(document);
      destroy(navigation);
    });

    return { document, navigation };
  });

  data = trackedTask(this, this.fetchData, () => [this.args.documentId]);
}
