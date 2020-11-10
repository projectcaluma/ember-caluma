import Component from "@ember/component";
import { inject as service } from "@ember/service";
import layout from "../../templates/components/cfb-form-editor/question";
import { task, timeout } from "ember-concurrency";
import { queryManager } from "ember-apollo-client";
import { v4 } from "uuid";
import { optional } from "ember-composable-helpers/helpers/optional";
import { computed, get } from "@ember/object";
import { reads } from "@ember/object/computed";
import slugify from "ember-caluma/utils/slugify";
import { A } from "@ember/array";
import validations from "ember-caluma/validations/question";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { all } from "rsvp";
import { getOwner } from "@ember/application";

import checkQuestionSlugQuery from "ember-caluma/gql/queries/check-question-slug";
import formEditorQuestionQuery from "ember-caluma/gql/queries/form-editor-question";
import addFormQuestionMutation from "ember-caluma/gql/mutations/add-form-question";
import formListQuery from "ember-caluma/gql/queries/form-list";
import allDataSourcesQuery from "ember-caluma/gql/queries/all-data-sources";
import saveOptionMutation from "ember-caluma/gql/mutations/save-option";
import saveTextQuestionMutation from "ember-caluma/gql/mutations/save-text-question";
import saveTextareaQuestionMutation from "ember-caluma/gql/mutations/save-textarea-question";
import saveIntegerQuestionMutation from "ember-caluma/gql/mutations/save-integer-question";
import saveFloatQuestionMutation from "ember-caluma/gql/mutations/save-float-question";
import saveMultipleChoiceQuestionMutation from "ember-caluma/gql/mutations/save-multiple-choice-question";
import saveChoiceQuestionMutation from "ember-caluma/gql/mutations/save-choice-question";
import saveTableQuestionMutation from "ember-caluma/gql/mutations/save-table-question";
import saveFormQuestionMutation from "ember-caluma/gql/mutations/save-form-question";
import saveFileQuestionMutation from "ember-caluma/gql/mutations/save-file-question";
import saveStaticQuestionMutation from "ember-caluma/gql/mutations/save-static-question";
import saveDateQuestionMutation from "ember-caluma/gql/mutations/save-date-question";
import saveDynamicMultipleChoiceQuestionMutation from "ember-caluma/gql/mutations/save-dynamic-multiple-choice-question";
import saveDynamicChoiceQuestionMutation from "ember-caluma/gql/mutations/save-dynamic-choice-question";

export const TYPES = {
  TextQuestion: saveTextQuestionMutation,
  TextareaQuestion: saveTextareaQuestionMutation,
  IntegerQuestion: saveIntegerQuestionMutation,
  FloatQuestion: saveFloatQuestionMutation,
  MultipleChoiceQuestion: saveMultipleChoiceQuestionMutation,
  ChoiceQuestion: saveChoiceQuestionMutation,
  DynamicMultipleChoiceQuestion: saveDynamicMultipleChoiceQuestionMutation,
  DynamicChoiceQuestion: saveDynamicChoiceQuestionMutation,
  TableQuestion: saveTableQuestionMutation,
  FormQuestion: saveFormQuestionMutation,
  FileQuestion: saveFileQuestionMutation,
  StaticQuestion: saveStaticQuestionMutation,
  DateQuestion: saveDateQuestionMutation,
};

export default Component.extend({
  layout,
  validations,

  notification: service(),
  intl: service(),
  calumaOptions: service(),

  apollo: queryManager(),

  linkSlug: true,

  possibleTypes: computed(function () {
    return Object.keys(TYPES).map((value) => ({
      value,
      label: this.intl.t(`caluma.form-builder.question.types.${value}`),
    }));
  }),

  async didReceiveAttrs() {
    this._super(...arguments);

    await this.data.perform();
    await this.availableForms.perform();
    await this.availableDataSources.perform();
  },

  data: task(function* () {
    if (!this.slug) {
      return A([
        {
          node: {
            label: "",
            slug: "",
            description: "",
            isRequired: "false",
            isHidden: "false",
            integerMinValue: null,
            integerMaxValue: null,
            floatMinValue: null,
            floatMaxValue: null,
            minLength: null,
            maxLength: null,
            options: [],
            rowForm: {},
            subForm: {},
            meta: {},
            dataSource: "",
            __typename: Object.keys(TYPES)[0],
          },
        },
      ]);
    }

    return yield this.apollo.watchQuery(
      {
        query: formEditorQuestionQuery,
        variables: { slug: this.slug },
        fetchPolicy: "cache-and-network",
      },
      "allQuestions.edges"
    );
  }).restartable(),

  availableForms: task(function* () {
    const forms = yield this.apollo.watchQuery(
      {
        query: formListQuery,
        variables: {
          filter: [{ isArchived: false }],
          order: [{ attribute: "NAME", direction: "ASC" }],
        },
        fetchPolicy: "cache-and-network",
      },
      "allForms.edges"
    );
    if (!forms.map) {
      return [];
    }
    return forms.mapBy("node.slug").filter((slug) => slug !== this.form);
  }).restartable(),

  availableOverrides: computed("changeset.__typename", function () {
    const type = this.changeset.get("__typename");
    const overrides = this.calumaOptions
      .getComponentOverrides()
      .filter((override) => {
        return !override.types || override.types.includes(type);
      });

    return [
      { label: this.intl.t("caluma.form.power-select.null"), component: "" },
      ...overrides,
    ];
  }),

  availableDataSources: task(function* () {
    const dataSources = yield this.apollo.watchQuery(
      { query: allDataSourcesQuery, fetchPolicy: "cache-and-network" },
      "allDataSources.edges"
    );
    if (!dataSources.mapBy) {
      return [];
    }
    return dataSources.map((edge) => {
      delete edge.node.__typename;
      return edge.node;
    });
  }).restartable(),

  model: reads("data.lastSuccessful.value.firstObject.node"),

  changeset: computed("model", function () {
    return new Changeset(this.model, lookupValidator(validations));
  }),

  prefix: computed("calumaOptions._namespace", function () {
    const namespace = this.calumaOptions.getNamespace();
    return namespace ? `${namespace}-` : "";
  }),

  requiredIsVisible: computed("changeset.{__typename,isRequired}", function () {
    const isRequired = this.changeset.get("isRequired");
    const typename = this.changeset.get("__typename");

    return (
      (isRequired === "true" || isRequired === "false") &&
      typename !== "StaticQuestion"
    );
  }),

  _getIntegerQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      minValue: parseInt(changeset.get("integerMinValue")),
      maxValue: parseInt(changeset.get("integerMaxValue")),
      placeholder: changeset.get("placeholder"),
    };
  },

  _getFloatQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      minValue: parseFloat(changeset.get("floatMinValue")),
      maxValue: parseFloat(changeset.get("floatMaxValue")),
      placeholder: changeset.get("placeholder"),
    };
  },

  _getTextQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      minLength: parseInt(changeset.get("minLength")),
      maxLength: parseInt(changeset.get("maxLength")),
      placeholder: changeset.get("placeholder"),
    };
  },

  _getTextareaQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      minLength: parseInt(changeset.get("minLength")),
      maxLength: parseInt(changeset.get("maxLength")),
      placeholder: changeset.get("placeholder"),
    };
  },

  _getMultipleChoiceQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      options: changeset.get("options.edges").map(({ node: { slug } }) => slug),
    };
  },

  _getChoiceQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      options: changeset.get("options.edges").map(({ node: { slug } }) => slug),
    };
  },

  _getDynamicMultipleChoiceQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      dataSource: changeset.get("dataSource"),
    };
  },

  _getDynamicChoiceQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      dataSource: changeset.get("dataSource"),
    };
  },

  _getTableQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      rowForm: changeset.get("rowForm.slug"),
    };
  },

  _getFormQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      subForm: changeset.get("subForm.slug"),
    };
  },

  _getFileQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
    };
  },

  _getStaticQuestionInput(changeset) {
    return {
      staticContent: changeset.get("staticContent"),
    };
  },

  _getDateQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
    };
  },

  saveOptions: task(function* (changeset) {
    yield all(
      (get(changeset, "options.edges") || []).map(async ({ node: option }) => {
        let { label, slug, isArchived } = option;

        await this.apollo.mutate({
          mutation: saveOptionMutation,
          variables: { input: { label, slug, isArchived } },
        });
      })
    );
  }),

  submit: task(function* (changeset) {
    try {
      const slug = ((!this.slug && this.prefix) || "") + changeset.get("slug");

      yield this.saveOptions.perform(changeset);

      const question = yield this.apollo.mutate(
        {
          mutation: TYPES[changeset.get("__typename")],
          variables: {
            input: Object.assign(
              {
                label: changeset.get("label"),
                slug,
                isHidden: changeset.get("isHidden"),
                infoText: changeset.get("infoText"),
                meta: JSON.stringify(changeset.get("meta")),
                isArchived: changeset.get("isArchived"),
                clientMutationId: v4(),
              },
              this[`_get${changeset.get("__typename")}Input`](changeset)
            ),
          },
        },
        `save${changeset.get("__typename")}.question`
      );

      if (!this.slug) {
        // This is a new question which must be added to the form after creating it
        yield this.apollo.mutate({
          mutation: addFormQuestionMutation,
          variables: {
            input: {
              question: question.slug,
              form: this.form,
              clientMutationId: v4(),
            },
            search: "",
          },
        });
      }

      this.notification.success(
        this.intl.t("caluma.form-builder.notification.question.save.success")
      );

      optional([this.get("on-after-submit")])(question);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.notification.danger(
        this.intl.t("caluma.form-builder.notification.question.save.error")
      );
    }
  }).drop(),

  validateSlug: task(function* (slug, changeset) {
    /* istanbul ignore next */
    if (
      getOwner(this).resolveRegistration("config:environment").environment !==
      "test"
    ) {
      yield timeout(500);
    }

    const res = yield this.apollo.query(
      {
        query: checkQuestionSlugQuery,
        variables: { slug },
      },
      "allQuestions.edges"
    );

    if (res && res.length) {
      changeset.pushErrors(
        "slug",
        this.intl.t("caluma.form-builder.validations.question.slug")
      );
    }
  }).restartable(),

  actions: {
    updateLabel(value, changeset) {
      changeset.set("label", value);

      if (!this.slug && this.linkSlug) {
        const slug = slugify(value, { locale: this.intl.primaryLocale });

        changeset.set("slug", slug);

        this.validateSlug.perform(this.prefix + slug, changeset);
      }
    },

    updateSlug(value, changeset) {
      changeset.set("slug", value);
      this.set("linkSlug", false);

      this.validateSlug.perform(this.prefix + value, changeset);
    },

    /*
     * This function adds the selected slugs to the columns to display
     * list if it isnt present, otherwise it will remove the slug.
     */
    toggleColumnToDisplay(value) {
      let displayed = new Set(this.get("model.meta.columnsToDisplay"));

      displayed.delete(value) || displayed.add(value);

      this.set("model.meta.columnsToDisplay", [...displayed]);
    },
  },
});
