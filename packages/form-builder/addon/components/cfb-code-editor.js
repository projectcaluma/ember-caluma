import { action } from "@ember/object";
import { addObserver } from "@ember/object/observers";
import Component from "@glimmer/component";
import { CodeJar } from "codejar";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import jexl from "highlightjs-jexl/src/languages/jexl";

hljs.configure({ ignoreUnescapedHTML: true });

hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("jexl", jexl);

export default class CfbCodeEditorComponent extends Component {
  _editor = null;
  _cursor = null;
  _lastValue = null;

  get value() {
    const value = this.args.value;

    if (this.args.language === "json" && typeof value === "object") {
      return JSON.stringify(value?.unwrap?.() ?? value, null, 2);
    }

    return this.args.value;
  }

  @action
  onUpdate(value) {
    if (this._lastValue === value) return;

    this._cursor = this._editor.save();

    if (this.args.language === "json") {
      try {
        value = JSON.parse(value);
      } catch {
        // update value directly
      }
    }

    this._lastValue = value;
    this.args.update(value);
  }

  @action
  updateCode() {
    this._editor.updateCode(this.value);

    if (this._cursor) {
      this._editor.restore(this._cursor);
      this._cursor = null;
    }
  }

  @action
  didInsertNode(element) {
    this._editor = CodeJar(element, (editor) => hljs.highlightElement(editor));
    this._editor.onUpdate(this.onUpdate);

    this.updateCode();

    // eslint-disable-next-line ember/no-observers
    addObserver(this.args, "value", this, "updateCode");
  }

  @action
  willDestroyNode() {
    this._editor.destroy();
  }
}
