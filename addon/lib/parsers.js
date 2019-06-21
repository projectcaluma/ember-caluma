import { assert } from "@ember/debug";

export const parseDocument = response => {
  assert(
    "The passed document must be a GraphQL document",
    response.__typename === "Document"
  );
  assert("The passed document must include a form", response.form);
  assert("The passed document must include answers", response.answers);

  return {
    ...response,
    rootForm: parseForm(response.form),
    answers: response.answers.edges.map(({ node }) => parseAnswer(node)),
    forms: parseFormTree(response.form)
  };
};

export const parseForm = response => {
  assert(
    "The passed form must be a GraphQL form",
    response.__typename === "Form"
  );

  return {
    ...response,
    questions: response.questions.edges.map(({ node }) => parseQuestion(node))
  };
};

export const parseFormTree = response => {
  const form = parseForm(response);

  return [
    form,
    ...form.questions.reduce((subForms, question) => {
      return [
        ...subForms,
        ...(question.subForm ? parseFormTree(question.subForm) : [])
      ];
    }, [])
  ];
};

export const parseAnswer = response => {
  assert(
    "The passed answer must be a GraphQL answer",
    /Answer$/.test(response.__typename)
  );

  return { ...response };
};

export const parseQuestion = response => {
  assert(
    "The passed question must be a GraphQL question",
    /Question$/.test(response.__typename)
  );

  return { ...response };
};

export default {
  parseDocument,
  parseForm,
  parseFormTree,
  parseAnswer,
  parseQuestion
};
