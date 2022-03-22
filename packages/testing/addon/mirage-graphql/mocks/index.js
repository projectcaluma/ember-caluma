import AnswerMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/answer";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";
import FormMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/form";
import QuestionMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/question";
import WorkItemMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/work-item";

const MOCK_MAPPING = {
  Answer: AnswerMock,
  Form: FormMock,
  Question: QuestionMock,
  WorkItem: WorkItemMock,
};

export default function createMock(type, ...args) {
  const MockClass = MOCK_MAPPING[type] ?? BaseMock;
  return new MockClass(type, ...args);
}
