import TableComponent from "ember-caluma/components/cf-field/input/table";
import { parseDocument } from "ember-caluma/lib/parsers";

export default class CfbFormEditorQuestionDefaultTableComponent extends TableComponent {
  parseDocument(raw) {
    raw.form.questions.edges = raw.form.questions.edges.map((edge) => ({
      node: { ...edge.node, isHidden: "false", isRequired: "false" },
    }));

    return parseDocument(raw);
  }
}
