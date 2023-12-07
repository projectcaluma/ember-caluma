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
  _lastValue = this.args.value;

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
    if (this._lastValue === this.value) return;

    this._editor.updateCode(this.value, false);

    if (this._cursor) {
      this._editor.restore(this._cursor);
      this._cursor = null;
    }
  }

  @action
  didInsertNode(element) {
    this._editor = CodeJar(element, (editor) => {
      editor.removeAttribute("data-highlighted");
      hljs.highlightElement(editor);
    });

    // set initial value
    this._editor.updateCode(this.value);

    // register update method
    this._editor.onUpdate(this.onUpdate);

    // eslint-disable-next-line ember/no-observers
    addObserver(this.args, "value", this, "updateCode");
  }

  @action
  willDestroyNode() {
    this._editor.destroy();
  }
}
