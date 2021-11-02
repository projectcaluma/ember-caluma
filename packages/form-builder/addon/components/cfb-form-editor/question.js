import { getOwner } from "@ember/application";
import { A } from "@ember/array";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { camelize } from "@ember/string";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { optional } from "ember-composable-helpers/helpers/optional";
import { dropTask, restartableTask, task, timeout } from "ember-concurrency";
import { all } from "rsvp";

import { hasQuestionType } from "@projectcaluma/ember-core/helpers/has-question-type";
import slugify from "@projectcaluma/ember-core/utils/slugify";
import addFormQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/add-form-question.graphql";
import removeDefaultAnswerMutation from "@projectcaluma/ember-form-builder/gql/mutations/remove-default-answer.graphql";
import saveActionButtonQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-action-button-question.graphql";
import saveCalculatedFloatQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-calculated-float-question.graphql";
import saveChoiceQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-choice-question.graphql";
import saveDateQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-date-question.graphql";
import saveDefaultDateAnswerMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-default-date-answer.graphql";
import saveDefaultFloatAnswerMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-default-float-answer.graphql";
import saveDefaultIntegerAnswerMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-default-integer-answer.graphql";
import saveDefaultListAnswerMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-default-list-answer.graphql";
import saveDefaultStringAnswerMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-default-string-answer.graphql";
import saveDefaultTableAnswerMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-default-table-answer.graphql";
import saveDynamicChoiceQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-dynamic-choice-question.graphql";
import saveDynamicMultipleChoiceQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-dynamic-multiple-choice-question.graphql";
import saveFileQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-file-question.graphql";
import saveFloatQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-float-question.graphql";
import saveFormQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-form-question.graphql";
import saveIntegerQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-integer-question.graphql";
import saveMultipleChoiceQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-multiple-choice-question.graphql";
import saveOptionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-option.graphql";
import saveStaticQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-static-question.graphql";
import saveTableQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-table-question.graphql";
import saveTextQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-text-question.graphql";
import saveTextareaQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-textarea-question.graphql";
import allDataSourcesQuery from "@projectcaluma/ember-form-builder/gql/queries/all-data-sources.graphql";
import checkQuestionSlugQuery from "@projectcaluma/ember-form-builder/gql/queries/check-question-slug.graphql";
import formEditorQuestionQuery from "@projectcaluma/ember-form-builder/gql/queries/form-editor-question.graphql";
import formListQuery from "@projectcaluma/ember-form-builder/gql/queries/form-list.graphql";
import validations from "@projectcaluma/ember-form-builder/validations/question";

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
  ActionButtonQuestion: saveActionButtonQuestionMutation,
};

const ACTIONS = ["COMPLETE", "SKIP"];

const COLORS = ["PRIMARY", "SECONDARY", "DEFAULT"];

const TYPES_ANSWER = {
  StringAnswer: saveDefaultStringAnswerMutation,
  IntegerAnswer: saveDefaultIntegerAnswerMutation,
  FloatAnswer: saveDefaultFloatAnswerMutation,
  DateAnswer: saveDefaultDateAnswerMutation,
  ListAnswer: saveDefaultListAnswerMutation,
  TableAnswer: saveDefaultTableAnswerMutation,
};

export default class CfbFormEditorQuestion extends Component {
  @service notification;
  @service intl;
  @service calumaOptions;
  @queryManager apollo;

  @tracked linkSlug = true;

  @restartableTask
  *data() {
    if (!this.args.slug) {
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
            // action button
            action: ACTIONS[0],
            color: COLORS[0],
            validateOnEnter: false,
            __typename: Object.keys(TYPES)[0],
          },
        },
      ]);
    }

    return yield this.apollo.watchQuery(
      {
        query: formEditorQuestionQuery,
        variables: { slug: this.args.slug },
        fetchPolicy: "cache-and-network",
      },
      "allQuestions.edges"
    );
  }

  @restartableTask
  *availableForms() {
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
    return forms.mapBy("node").filter((form) => form.slug !== this.args.form);
  }

  @restartableTask
  *availableDataSources() {
    const dataSources = yield this.apollo.watchQuery(
      { query: allDataSourcesQuery, fetchPolicy: "cache-and-network" },
      "allDataSources.edges"
    );
    return dataSources.map((edge) => {
      return {
        ...edge.node,
        __typename: undefined,
      };
    });
  }

  get possibleTypes() {
    return Object.keys(TYPES).map((value) => ({
      value,
      label: this.intl.t(`caluma.form-builder.question.types.${value}`),
    }));
  }

  get possibleActions() {
    return ACTIONS.map((value) => ({
      value,
      label: this.intl.t(`caluma.form-builder.question.actions.${value}`),
    }));
  }

  get possibleColors() {
    return COLORS.map((value) => ({
      value,
      label: this.intl.t(`caluma.form-builder.question.colors.${value}`),
    }));
  }

  get availableOverrides() {
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
  }

  get model() {
    return this.data.lastSuccessful?.value?.firstObject?.node;
  }

  get changeset() {
    return new Changeset(this.model, lookupValidator(validations), validations);
  }

  get prefix() {
    return this.calumaOptions.namespace
      ? `${this.calumaOptions.namespace}-`
      : "";
  }

  getInput(changeset) {
    const slug =
      ((!this.args.slug && this.prefix) || "") + changeset.get("slug");

    const input = {
      slug,
      label: changeset.get("label"),
      isHidden: changeset.get("isHidden"),
      infoText: changeset.get("infoText"),
      meta: JSON.stringify(changeset.get("meta").unwrap()),
      isArchived: changeset.get("isArchived"),
    };

    if (!hasQuestionType(changeset, "static", "calculated-float")) {
      Object.assign(input, {
        isRequired: changeset.get("isRequired"),
      });
    }

    const typeSpecificInputKey = `_get${changeset.get("__typename")}Input`;
    if (typeof this[typeSpecificInputKey] === "function") {
      Object.assign(input, this[typeSpecificInputKey](changeset));
    }

    return input;
  }

  _getIntegerQuestionInput(changeset) {
    return {
      minValue: parseInt(changeset.get("integerMinValue")),
      maxValue: parseInt(changeset.get("integerMaxValue")),
      placeholder: changeset.get("placeholder"),
    };
  }

  _getFloatQuestionInput(changeset) {
    return {
      minValue: parseFloat(changeset.get("floatMinValue")),
      maxValue: parseFloat(changeset.get("floatMaxValue")),
      placeholder: changeset.get("placeholder"),
    };
  }

  _getTextQuestionInput(changeset) {
    return {
      minLength: parseInt(changeset.get("minLength")),
      maxLength: parseInt(changeset.get("maxLength")),
      placeholder: changeset.get("placeholder"),
    };
  }

  _getTextareaQuestionInput(changeset) {
    return {
      minLength: parseInt(changeset.get("minLength")),
      maxLength: parseInt(changeset.get("maxLength")),
      placeholder: changeset.get("placeholder"),
    };
  }

  _getMultipleChoiceQuestionInput(changeset) {
    return {
      options: changeset.get("options.edges").map(({ node: { slug } }) => slug),
    };
  }

  _getChoiceQuestionInput(changeset) {
    return {
      options: changeset.get("options.edges").map(({ node: { slug } }) => slug),
    };
  }

  _getDynamicMultipleChoiceQuestionInput(changeset) {
    return {
      dataSource: changeset.get("dataSource"),
    };
  }

  _getDynamicChoiceQuestionInput(changeset) {
    return {
      dataSource: changeset.get("dataSource"),
    };
  }

  _getTableQuestionInput(changeset) {
    return {
      rowForm: changeset.get("rowForm.slug"),
    };
  }

  _getFormQuestionInput(changeset) {
    return {
      subForm: changeset.get("subForm.slug"),
    };
  }

  _getStaticQuestionInput(changeset) {
    return {
      staticContent: changeset.get("staticContent"),
    };
  }

  _getCalculatedFloatQuestionInput(changeset) {
    return {
      calcExpression: changeset.get("calcExpression"),
    };
  }

  _getActionButtonQuestionInput(changeset) {
    return {
      action: changeset.get("action"),
      color: changeset.get("color"),
      validateOnEnter: Boolean(changeset.get("validateOnEnter")),
    };
  }

  @task
  *saveOptions(changeset) {
    yield all(
      (changeset.get("options.edges") || []).map(async ({ node: option }) => {
        const { label, slug, isArchived } = option;

        await this.apollo.mutate({
          mutation: saveOptionMutation,
          variables: { input: { label, slug, isArchived } },
        });
      })
    );
  }

  @task
  *saveDefaultAnswer(question, changeset) {
    if (!changeset.get("defaultAnswer")) {
      return;
    }

    const typename = changeset.get("defaultAnswer.__typename");
    const valueKey = camelize(typename.replace(/Answer$/, "Value"));
    const value = changeset.get(`defaultAnswer.${valueKey}`);

    // We need to map the UUIDs of the document's if the user didn't touch
    // the default answer and thus never triggered the onUpdate action.
    if (typename === "TableAnswer" && typeof value[0] !== "string") {
      return;
    }

    const isAddMutation = value !== null && value.length !== 0;

    // Save or remove depending on the value.
    const mutation = !isAddMutation
      ? removeDefaultAnswerMutation
      : TYPES_ANSWER[typename];

    const input = { question: question.slug };

    // The remove mutation must not include a value.
    if (isAddMutation) {
      input.value = value;
    }

    yield this.apollo.mutate({ mutation, variables: { input } });
  }

  @dropTask
  *submit(changeset) {
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

      if (!this.args.slug) {
        // This is a new question which must be added to the form after creating it
        yield this.apollo.mutate({
          mutation: addFormQuestionMutation,
          variables: {
            input: {
              question: question.slug,
              form: this.args.form,
            },
            search: "",
          },
        });
      }

      this.notification.success(
        this.intl.t("caluma.form-builder.notification.question.save.success")
      );

      optional([this.args["on-after-submit"]])(question);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.notification.danger(
        this.intl.t("caluma.form-builder.notification.question.save.error")
      );
    }
  }

  @restartableTask
  *validateSlug(slug, changeset) {
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
  }

  @action
  async fetchData() {
    await this.data.perform();
    await this.availableForms.perform();
    await this.availableDataSources.perform();
  }

  @action
  updateLabel(value, changeset) {
    changeset.set("label", value);

    if (!this.args.slug && this.linkSlug) {
      const slug = slugify(value, { locale: this.intl.primaryLocale });

      changeset.set("slug", slug);

      this.validateSlug.perform(this.prefix + slug, changeset);
    }
  }

  @action
  updateSlug(value, changeset) {
    changeset.set("slug", value);
    this.linkSlug = false;

    this.validateSlug.perform(this.prefix + value, changeset);
  }

  /*
   * This function adds the selected slugs to the columns to display
   * list if it isnt present, otherwise it will remove the slug.
   */
  @action
  toggleColumnToDisplay(value, changeset) {
    const displayed = new Set(changeset.get("meta.columnsToDisplay"));

    displayed.delete(value) || displayed.add(value);

    changeset.set("meta.columnsToDisplay", [...displayed]);
  }

  @action
  updateSubForm(value, changeset) {
    changeset.set("subForm.slug", value.slug);
  }

  @action
  updateRowForm(value, changeset) {
    changeset.set("rowForm.slug", value.slug);
  }
}
