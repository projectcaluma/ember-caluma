import Component from "@glimmer/component";
import jexl from "jexl";
import { v4 } from "uuid";

import { hasQuestionType } from "ember-caluma/helpers/has-question-type";

export default class CfbFormEditorQuestionListItem extends Component {
  constructor(...args) {
    super(...args);

    this.elementId = v4();
  }

  get required() {
    try {
      return jexl.evalSync(this.args.question?.isRequired);
    } catch (error) {
      return false;
    }
  }

  get showFormLink() {
    const question = this.args.question;
    return (
      this.args.mode === "reorder" &&
      (hasQuestionType(question, "form") || hasQuestionType(question, "table"))
    );
  }
}
