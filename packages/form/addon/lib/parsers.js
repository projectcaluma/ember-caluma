import { assert, warn } from "@ember/debug";

export const parseDocument = (response) => {
  assert(
    "The passed document must be a GraphQL document",
    response.__typename.includes("Document"),
  );
  assert("The passed document must include a form", response.form);
  assert("The passed document must include answers", response.answers);

  return {
    ...response,
    rootForm: parseForm(response.form),
    answers: response.answers.edges.map(({ node }) =>
      parseAnswer(node, response?.historyType),
    ),
    historicalAnswers: response?.historicalAnswers?.edges?.map(({ node }) =>
      parseAnswer(node, response?.historyType),
    ),
    forms: parseFormTree(response.form),
  };
};

export const parseForm = (response) => {
  assert(
    "The passed form must be a GraphQL form",
    response.__typename === "Form",
  );

  return {
    ...response,
    questions: response.questions.edges.map(({ node }) => parseQuestion(node)),
  };
};

export const parseFormTree = (response) => {
  const form = parseForm(response);

  return [
    form,
    ...form.questions.reduce((subForms, question) => {
      return [
        ...subForms,
        ...(question.subForm ? parseFormTree(question.subForm) : []),
      ];
    }, []),
  ];
};

export const parseAnswer = (response, historyType = null) => {
  assert(
    "The passed answer must be a GraphQL answer",
    /Answer$/.test(response.__typename),
  );

  // if a whole document is marked as added or removed, we need to
  // propagate that to all the underlying answers as well.
  return {
    ...response,
    // If the parent document was removed/added, propagate that
    // history type to the answer as well.
    historyType: ["-", "+"].includes(historyType)
      ? historyType
      : response.historyType,
  };
};

/**
 * Parse the widget and detects a widget override.
 *
 * @param {Array} params
 * @param {Object} options
 * @returns {Object} {widget: String, override: Boolean}
 */
export function parseWidgetType(calumaOptions, params, options = {}) {
  for (const obj of params) {
    let widget = obj?.raw?.meta?.widgetOverride;
    if (obj?.useNumberSeparatorWidget) {
      widget = "cf-field/input/number-separator";
    }

    if (!widget) {
      continue;
    }

    if (
      !calumaOptions
        .getComponentOverrides()
        .find(({ component }) => component === widget)
    ) {
      warn(
        `Widget override "${widget}" is not registered. Please register it by calling \`calumaOptions.registerComponentOverride\``,
        widget,
        { id: "ember-caluma.unregistered-override" },
      );
      continue;
    }

    return { widget, override: true };
  }

  return { widget: options?.default ?? "cf-field/input", override: false };
}

export const parseQuestion = (response) => {
  assert(
    "The passed question must be a GraphQL question",
    /Question$/.test(response.__typename),
  );

  return { ...response };
};

export default {
  parseDocument,
  parseForm,
  parseFormTree,
  parseAnswer,
  parseQuestion,
  parseWidgetType,
};
