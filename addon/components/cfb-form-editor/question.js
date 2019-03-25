import Component from "@ember/component";
import { inject as service } from "@ember/service";
import layout from "../../templates/components/cfb-form-editor/question";
import { task, timeout } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import v4 from "uuid/v4";
import { optional } from "ember-composable-helpers/helpers/optional";
import { computed, getWithDefault } from "@ember/object";
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

import saveOptionMutation from "ember-caluma/gql/mutations/save-option";
import saveTextQuestionMutation from "ember-caluma/gql/mutations/save-text-question";
import saveTextareaQuestionMutation from "ember-caluma/gql/mutations/save-textarea-question";
import saveIntegerQuestionMutation from "ember-caluma/gql/mutations/save-integer-question";
import saveFloatQuestionMutation from "ember-caluma/gql/mutations/save-float-question";
import saveMultipleChoiceQuestionMutation from "ember-caluma/gql/mutations/save-multiple-choice-question";
import saveChoiceQuestionMutation from "ember-caluma/gql/mutations/save-choice-question";
import saveTableQuestionMutation from "ember-caluma/gql/mutations/save-table-question";
import saveDateQuestionMutation from "ember-caluma/gql/mutations/save-date-question";
import saveFormQuestionMutation from "ember-caluma/gql/mutations/save-form-question";
import saveFileQuestionMutation from "ember-caluma/gql/mutations/save-file-question";
import saveStaticQuestionMutation from "ember-caluma/gql/mutations/save-static-question";
import saveDateQuestionMutation from "ember-caluma/gql/mutations/save-date-question";

export const TYPES = {
  TextQuestion: saveTextQuestionMutation,
  TextareaQuestion: saveTextareaQuestionMutation,
  IntegerQuestion: saveIntegerQuestionMutation,
  FloatQuestion: saveFloatQuestionMutation,
  MultipleChoiceQuestion: saveMultipleChoiceQuestionMutation,
  ChoiceQuestion: saveChoiceQuestionMutation,
  TableQuestion: saveTableQuestionMutation,
  FormQuestion: saveFormQuestionMutation,
  FileQuestion: saveFileQuestionMutation,
  StaticQuestion: saveStaticQuestionMutation,
  DateQuestion: saveDateQuestionMutation
};

export default Component.extend(ComponentQueryManager, {
  layout,
  validations,

  notification: service(),
  intl: service(),
  calumaOptions: service(),

  /**
   * Determines if the slug is "linked" to the question label, i.e. follows it's updates
   * @property linkSlug
   */
  linkSlug: true,

  possibleTypes: computed(function() {
    return Object.keys(TYPES).map(value => ({
      value,
      label: this.intl.t(`caluma.form-builder.question.types.${value}`)
    }));
  }),

  async didReceiveAttrs() {
    this._super(...arguments);

    await this.get("data").perform();
    await this.get("availableForms").perform();
  },

  data: task(function*() {
    if (!this.get("slug")) {
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
            maxLength: null,
            options: [],
            rowForm: "",
            subForm: "",
            __typename: Object.keys(TYPES)[0]
          }
        }
      ]);
    }

    const questions = yield this.get("apollo").watchQuery(
      {
        query: formEditorQuestionQuery,
        variables: { slug: this.get("slug") },
        fetchPolicy: "cache-and-network"
      },
      "allQuestions.edges"
    );

    return A(
      questions.map(question => {
        question.node.widgetOverride =
          question.node.meta.widgetOverride || null;
        return question;
      })
    );
  }).restartable(),

  availableForms: task(function*() {
    const forms = yield this.get("apollo").watchQuery(
      {
        query: formListQuery,
        fetchPolicy: "cache-and-network"
      },
      "allForms.edges"
    );
    if (!forms.map) {
      return [];
    }
    return forms
      .map(edge => edge.node.slug)
      .filter(slug => slug !== this.get("form"));
  }).restartable(),

  availableOverrides: computed("changeset.__typename", function() {
    const type = this.changeset.get("__typename");
    const overrides = this.calumaOptions
      .getComponentOverrides()
      .filter(override => {
        return !override.types || override.types.includes(type);
      });

    return [
      { label: this.intl.t("caluma.form.power-select.null"), component: "" },
      ...overrides
    ];
  }),

  model: computed("data.lastSuccessful.value.firstObject.node", function() {
    const model = this.get("data.lastSuccessful.value.firstObject.node");
    // flatten attributes until nested property support landed in ember-validated-form
    if (model && model.rowForm) {
      model.rowForm = model.rowForm.slug;
    }
    if (model && model.subForm) {
      model.subForm = model.subForm.slug;
    }
    if (model && model.meta && model.meta.hideLabel) {
      model.hideLabel = model.meta.hideLabel;
    }
    return model;
  }),

  changeset: computed("model", function() {
    return new Changeset(this.model, lookupValidator(validations));
  }),

  prefix: computed("calumaOptions._namespace", function() {
    const namespace = this.calumaOptions.getNamespace();
    return namespace ? `${namespace}-` : "";
  }),

  _getIntegerQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      minValue: parseInt(changeset.get("integerMinValue")),
      maxValue: parseInt(changeset.get("integerMaxValue")),
      placeholder: changeset.get("placeholder")
    };
  },

  _getFloatQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      minValue: parseFloat(changeset.get("floatMinValue")),
      maxValue: parseFloat(changeset.get("floatMaxValue")),
      placeholder: changeset.get("placeholder")
    };
  },

  _getTextQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      maxLength: parseInt(changeset.get("maxLength")),
      placeholder: changeset.get("placeholder")
    };
  },

  _getTextareaQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      maxLength: parseInt(changeset.get("maxLength")),
      placeholder: changeset.get("placeholder")
    };
  },

  _getMultipleChoiceQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      options: changeset.get("options.edges").map(({ node: { slug } }) => slug),
      meta: JSON.stringify({
        widgetOverride: changeset.get("widgetOverride"),
        hideLabel: changeset.get("hideLabel")
      })
    };
  },

  _getChoiceQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      options: changeset.get("options.edges").map(({ node: { slug } }) => slug),
      meta: JSON.stringify({
        widgetOverride: changeset.get("widgetOverride"),
        hideLabel: changeset.get("hideLabel")
      })
    };
  },

  _getTableQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      rowForm: changeset.get("rowForm")
    };
  },

  _getFormQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired"),
      subForm: changeset.get("subForm")
    };
  },

  _getDateQuestionInput(/*changeset*/) {
    return {};
  },

  _getFileQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired")
    };
  },

  _getStaticQuestionInput(changeset) {
    return {
      staticContent: changeset.get("staticContent")
    };
  },

  _getDateQuestionInput(changeset) {
    return {
      isRequired: changeset.get("isRequired")
    };
  },

  saveOptions: task(function*(changeset) {
    yield all(
      getWithDefault(changeset, "options.edges", []).map(
        async ({ node: option }) => {
          let { label, slug } = option;

          await this.get("apollo").mutate({
            mutation: saveOptionMutation,
            variables: { input: { label, slug } }
          });
        }
      )
    );
  }),

  submit: task(function*(changeset) {
    try {
      const slug =
        ((!this.get("slug") && this.prefix) || "") + changeset.get("slug");

      yield this.saveOptions.perform(changeset);

      const question = yield this.get("apollo").mutate(
        {
          mutation: TYPES[changeset.get("__typename")],
          variables: {
            input: Object.assign(
              {
                label: changeset.get("label"),
                slug,
                isHidden: changeset.get("isHidden"),
                infoText: changeset.get("infoText"),
                meta: JSON.stringify({
                  widgetOverride: changeset.get("widgetOverride")
                }),
                isArchived: changeset.get("isArchived"),
                clientMutationId: v4()
              },
              this[`_get${changeset.get("__typename")}Input`](changeset)
            )
          }
        },
        `save${changeset.get("__typename")}.question`
      );

      if (!this.get("slug")) {
        // This is a new question which must be added to the form after creating it
        yield this.get("apollo").mutate({
          mutation: addFormQuestionMutation,
          variables: {
            input: {
              question: question.slug,
              form: this.get("form"),
              clientMutationId: v4()
            },
            search: ""
          }
        });
      }

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.question.save.success"
        )
      );

      optional([this.get("on-after-submit")])(question);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.get("notification").danger(
        this.get("intl").t(
          "caluma.form-builder.notification.question.save.error"
        )
      );
    }
  }).drop(),

  validateSlug: task(function*(slug, changeset) {
    /* istanbul ignore next */
    if (
      getOwner(this).resolveRegistration("config:environment").environment !==
      "test"
    ) {
      yield timeout(500);
    }

    const res = yield this.get("apollo").query(
      {
        query: checkQuestionSlugQuery,
        variables: { slug }
      },
      "allQuestions.edges"
    );

    if (res && res.length) {
      changeset.pushErrors(
        "slug",
        this.get("intl").t("caluma.form-builder.validations.question.slug")
      );
    }
  }).restartable(),

  actions: {
    updateLabel(value, changeset) {
      changeset.set("label", value);

      if (!this.get("slug") && this.get("linkSlug")) {
        const slug = slugify(value);

        changeset.set("slug", slug);

        this.get("validateSlug").perform(this.prefix + slug, changeset);
      }
    },

    updateSlug(value, changeset) {
      changeset.set("slug", value);
      this.set("linkSlug", false);

      this.get("validateSlug").perform(this.prefix + value, changeset);
    }
  }
});
