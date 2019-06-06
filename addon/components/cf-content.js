import Component from "@ember/component";
import layout from "../templates/components/cf-content";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { ComponentQueryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import getNavigationQuery from "ember-caluma/gql/queries/get-navigation";

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

    return yield this.apollo.watchQuery(
      {
        query: getNavigationQuery,
        variables: { id: window.btoa("Document:" + this.documentId) },
        fetchPolicy: "network-only",
        context: { headers: this.get("context.headers") }
      },
      "node"
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
