import { assert } from "@ember/debug";

export const parseDocument = (response): RawDocument => {
  assert(
    "The passed document must be a GraphQL document",
    response.__typename === "Document"
  );
  assert("The passed document must include a form", response.form);
  assert("The passed document must include answers", response.answers);

  return {
    ...response,
    rootForm: parseForm(response.form),
    answers: response.answers.edges.map(
      ({ node }: { node: RawAnswer }) => node
    ),
    forms: parseFormTree(response.form),
  };
};

export const parseForm = (response): RawForm => {
  assert(
    "The passed form must be a GraphQL form",
    response.__typename === "Form"
  );

  return {
    ...response,
    questions: response.questions.edges.map(
      ({ node }: { node: RawQuestion }) => node
    ),
  };
};

export const parseFormTree = (response): RawForm[] => {
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

export default {
  parseDocument,
  parseForm,
  parseFormTree,
};
