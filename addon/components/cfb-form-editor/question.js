import { getOwner } from "@ember/application";
import { A } from "@ember/array";
import Component from "@ember/component";
import { computed, get } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { camelize } from "@ember/string";
import { queryManager } from "ember-apollo-client";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { optional } from "ember-composable-helpers/helpers/optional";
import { task, timeout } from "ember-concurrency";
import { all } from "rsvp";

import layout from "../../templates/components/cfb-form-editor/question";

import addFormQuestionMutation from "ember-caluma/gql/mutations/add-form-question";
import removeDefaultAnswerMutation from "ember-caluma/gql/mutations/remove-default-answer";
import saveCalculatedFloatQuestionMutation from "ember-caluma/gql/mutations/save-calculated-float-question";
import saveChoiceQuestionMutation from "ember-caluma/gql/mutations/save-choice-question";
import saveDateQuestionMutation from "ember-caluma/gql/mutations/save-date-question";
import saveDefaultDateAnswerMutation from "ember-caluma/gql/mutations/save-default-date-answer";
import saveDefaultFloatAnswerMutation from "ember-caluma/gql/mutations/save-default-float-answer";
import saveDefaultIntegerAnswerMutation from "ember-caluma/gql/mutations/save-default-integer-answer";
import saveDefaultListAnswerMutation from "ember-caluma/gql/mutations/save-default-list-answer";
import saveDefaultStringAnswerMutation from "ember-caluma/gql/mutations/save-default-string-answer";
import saveDefaultTableAnswerMutation from "ember-caluma/gql/mutations/save-default-table-answer";
import saveDynamicChoiceQuestionMutation from "ember-caluma/gql/mutations/save-dynamic-choice-question";
import saveDynamicMultipleChoiceQuestionMutation from "ember-caluma/gql/mutations/save-dynamic-multiple-choice-question";
import saveFileQuestionMutation from "ember-caluma/gql/mutations/save-file-question";
import saveFloatQuestionMutation from "ember-caluma/gql/mutations/save-float-question";
import saveFormQuestionMutation from "ember-caluma/gql/mutations/save-form-question";
import saveIntegerQuestionMutation from "ember-caluma/gql/mutations/save-integer-question";
import saveMultipleChoiceQuestionMutation from "ember-caluma/gql/mutations/save-multiple-choice-question";
import saveOptionMutation from "ember-caluma/gql/mutations/save-option";
import saveStaticQuestionMutation from "ember-caluma/gql/mutations/save-static-question";
import saveTableQuestionMutation from "ember-caluma/gql/mutations/save-table-question";
import saveTextQuestionMutation from "ember-caluma/gql/mutations/save-text-question";
import saveTextareaQuestionMutation from "ember-caluma/gql/mutations/save-textarea-question";
import allDataSourcesQuery from "ember-caluma/gql/queries/all-data-sources";
import checkQuestionSlugQuery from "ember-caluma/gql/queries/check-question-slug";
import formEditorQuestionQuery from "ember-caluma/gql/queries/form-editor-question";
import formListQuery from "ember-caluma/gql/queries/form-list";
import slugify from "ember-caluma/utils/slugify";
import validations from "ember-caluma/validations/question";

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
  CalculatedFloatQuestion: saveCalculatedFloatQuestionMutation,
};

const TYPES_ANSWER = {
  StringAnswer: saveDefaultStringAnswerMutation,
  IntegerAnswer: saveDefaultIntegerAnswerMutation,
  FloatAnswer: saveDefaultFloatAnswerMutation,
  DateAnswer: saveDefaultDateAnswerMutation,
  ListAnswer: saveDefaultListAnswerMutation,
  TableAnswer: saveDefaultTableAnswerMutation,
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
    this._super();
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
            calcExpression: "",
            integerMinValue: null,
            integerMaxValue: null,
            floatMinValue: null,
            floatMaxValue: null,
            minLength: null,
            maxLength: null,
            defaultAnswer: null,
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
      !["StaticQuestion", "CalculatedFloatQuestion"].includes(typename)
    );
  }),

  getInput(changeset) {
    const slug = ((!this.slug && this.prefix) || "") + changeset.get("slug");

    const input = {
      slug,
      label: changeset.get("label"),
      isHidden: changeset.get("isHidden"),
      infoText: changeset.get("infoText"),
      meta: JSON.stringify(changeset.get("meta").unwrap()),
      isArchived: changeset.get("isArchived"),
    };

    if (this.requiredIsVisible) {
      Object.assign(input, {
        isRequired: changeset.get("isRequired"),
      });
    }

    const typeSpecificInputKey = `_get${changeset.get("__typename")}Input`;
    if (typeof this[typeSpecificInputKey] === "function") {
      Object.assign(input, this[typeSpecificInputKey](changeset));
    }

    return input;
  },

  _getIntegerQuestionInput(changeset) {
    return {
      minValue: parseInt(changeset.get("integerMinValue")),
      maxValue: parseInt(changeset.get("integerMaxValue")),
      placeholder: changeset.get("placeholder"),
    };
  },

  _getFloatQuestionInput(changeset) {
    return {
      minValue: parseFloat(changeset.get("floatMinValue")),
      maxValue: parseFloat(changeset.get("floatMaxValue")),
      placeholder: changeset.get("placeholder"),
    };
  },

  _getTextQuestionInput(changeset) {
    return {
      minLength: parseInt(changeset.get("minLength")),
      maxLength: parseInt(changeset.get("maxLength")),
      placeholder: changeset.get("placeholder"),
    };
  },

  _getTextareaQuestionInput(changeset) {
    return {
      minLength: parseInt(changeset.get("minLength")),
      maxLength: parseInt(changeset.get("maxLength")),
      placeholder: changeset.get("placeholder"),
    };
  },

  _getMultipleChoiceQuestionInput(changeset) {
    return {
      options: changeset.get("options.edges").map(({ node: { slug } }) => slug),
    };
  },

  _getChoiceQuestionInput(changeset) {
    return {
      options: changeset.get("options.edges").map(({ node: { slug } }) => slug),
    };
  },

  _getDynamicMultipleChoiceQuestionInput(changeset) {
    return {
      dataSource: changeset.get("dataSource"),
    };
  },

  _getDynamicChoiceQuestionInput(changeset) {
    return {
      dataSource: changeset.get("dataSource"),
    };
  },

  _getTableQuestionInput(changeset) {
    return {
      rowForm: changeset.get("rowForm.slug"),
    };
  },

  _getFormQuestionInput(changeset) {
    return {
      subForm: changeset.get("subForm.slug"),
    };
  },

  _getStaticQuestionInput(changeset) {
    return {
      staticContent: changeset.get("staticContent"),
    };
  },

  _getCalculatedFloatQuestionInput(changeset) {
    return {
      calcExpression: changeset.get("calcExpression"),
    };
  },

  saveOptions: task(function* (changeset) {
    yield all(
      (get(changeset, "options.edges") || []).map(async ({ node: option }) => {
        const { label, slug, isArchived } = option;

        await this.apollo.mutate({
          mutation: saveOptionMutation,
          variables: { input: { label, slug, isArchived } },
        });
      })
    );
  }),

  saveDefaultAnswer: task(function* (question, changeset) {
    const answer = changeset.get("defaultAnswer");

    if (!answer) {
      return;
    }

    const valueKey = camelize(answer.__typename.replace(/Answer$/, "Value"));
    const value = answer[valueKey];

    // We need to map the UUIDs of the document's if the user didn't touch
    // the default answer and thus never triggered the onUpdate action.
    if (answer.__typename === "TableAnswer" && typeof value[0] !== "string") {
      return;
    }

    const isAddMutation = value !== null && value.length !== 0;

    // Save or remove depending on the value.
    const mutation = !isAddMutation
      ? removeDefaultAnswerMutation
      : TYPES_ANSWER[answer.__typename];

    const input = { question: question.slug };

    // The remove mutation must not include a value.
    if (isAddMutation) {
      input.value = value;
    }

    yield this.apollo.mutate({ mutation, variables: { input } });
  }),

  submit: task(function* (changeset) {
    try {
      yield this.saveOptions.perform(changeset);

      const typename = changeset.get("__typename");
      const input = this.getInput(changeset);
      const question = yield this.apollo.mutate(
        {
          mutation: TYPES[typename],
          variables: { input },
        },
        `save${typename}.question`
      );

      yield this.saveDefaultAnswer.perform(question, changeset);

      if (!this.slug) {
        // This is a new question which must be added to the form after creating it
        yield this.apollo.mutate({
          mutation: addFormQuestionMutation,
          variables: {
            input: {
              question: question.slug,
              form: this.form,
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
      const displayed = new Set(this.changeset.get("meta.columnsToDisplay"));

      displayed.delete(value) || displayed.add(value);

      this.changeset.set("meta.columnsToDisplay", [...displayed]);
    },
  },
});
