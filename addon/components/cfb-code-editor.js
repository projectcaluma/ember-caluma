import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { CodeJar } from "codejar";
import Prism from "prismjs";
import "prismjs/components/prism-jexl.js";
import "prismjs/components/prism-markdown.js";

export default class CfbCodeEditorComponent extends Component {
  editor;
  @tracked show = false;

  @action
  didInsertNode(element) {
    const highlight = (editor) => Prism.highlightElement(editor);
    this.editor = CodeJar(element, highlight);
    this.editor.updateCode(this.args.value);
    this.editor.onUpdate(this.args.update);
  }

  @action
  willDestroyNode() {
    this.editor.destroy();
  }
}
