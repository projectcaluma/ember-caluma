import TableComponent from "@projectcaluma/ember-form/components/cf-field/input/table";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

export default class CfbFormEditorQuestionDefaultTableComponent extends TableComponent {
  parseDocument(raw) {
    raw.form.questions.edges = raw.form.questions.edges.map((edge) => ({
      node: { ...edge.node, isHidden: "false", isRequired: "false" },
    }));

    return parseDocument(raw);
  }
}
