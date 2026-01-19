import { getOwner } from "@ember/application";
import { destroy, registerDestructor } from "@ember/destroyable";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

import getDocumentAnswersCompareQuery from "@projectcaluma/ember-form/gql/queries/document-answers-compare.graphql";
import getDocumentFormsQuery from "@projectcaluma/ember-form/gql/queries/document-forms.graphql";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

/**
 * Component to render a form with navigation and comparison.
 *
 * This component can either be used the default way:
 * ```hbs
 * <CfContentCompare @documentId="some-id" @compare={{hash
      from="yyyy-mm-dd"
      to="yyyy-mm-dd"
 * }} />
 * ```
 * Or it can be customized
 * ```hbs
 * <CfContentCompare @documentId="some-id" @compare={{hash
      from="yyyy-mm-dd"
      to="yyyy-mm-dd"
    }} as |content|}}
 *   <div uk-grid>
 *     <div class="uk-width-1-2"><content.navigation /></div>
 *     <div class="uk-width-1-2">
 *       <content.form />
 *       <hr>
 *       <content.pagination />
 *     </div>
 *   </div>
 * </CfContentCompare>
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
 * @class CfContentCompareComponent
 * @yield {Object} content
 * @yield {Document} content.document
 * @yield {CfFormComponent} content.form
 * @yield {CfNavigationComponent} content.navigation
 * @yield {CfPaginationComponent} content.pagination
 */
export default class CfContentCompareComponent extends Component {
  @service router;
  @service calumaStore;

  @queryManager apollo;

  /**
   * The uuid of the document to display
   *
   * @argument {String} documentId
   */

  /**
   * Must be used to pass "compare" context information from the outside.
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

  get disabled() {
    return true;
  }

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

  data = trackedTask(this, this.fetchData, () => [this.args.documentId]);

  @dropTask
  *fetchData() {
    if (this.document) destroy(this.document);
    if (this.navigation) destroy(this.navigation);

    if (!this.args.documentId) return;

    function toDate(input) {
      if (input instanceof Date) {
        return new Date(input.getTime());
      }

      return new Date(input);
    }

    const compareContext = { enabled: true, ...this.args.compare };
    const { from, to } = compareContext;

    const data = yield this.apollo.query({
      query: getDocumentAnswersCompareQuery,
      fetchPolicy: "network-only",
      variables: {
        documentId: this.args.documentId,
        from: toDate(from),
        to: toDate(to ?? new Date()),
      },
    });
    const historicalDocument = data.fromRevision;
    const answerDocument = data.toRevision;

    const [form] = (yield this.apollo.query(
      {
        query: getDocumentFormsQuery,
        fetchPolicy: "cache-first",
        variables: { slug: answerDocument.form.slug },
      },
      "allForms.edges",
    )).map(({ node }) => node);

    const owner = getOwner(this);
    const Document = owner.factoryFor("caluma-model:document").class;
    const Navigation = owner.factoryFor("caluma-model:navigation").class;

    const raw = parseDocument({
      ...{
        ...answerDocument,
        historicalAnswers: historicalDocument?.answers,
      },
      form,
    });

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
  }
}
