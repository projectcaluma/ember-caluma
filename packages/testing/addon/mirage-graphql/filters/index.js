import AnswerFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/answer";
import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";
import FormFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/form";
import QuestionFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/question";
import WorkItemFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/work-item";

const FILTER_MAPPING = {
  Answer: AnswerFilter,
  Form: FormFilter,
  Question: QuestionFilter,
  WorkItem: WorkItemFilter,
};

export default function createFilter(type, ...args) {
  const FilterClass = FILTER_MAPPING[type] ?? BaseFilter;
  return new FilterClass(type, ...args);
}
