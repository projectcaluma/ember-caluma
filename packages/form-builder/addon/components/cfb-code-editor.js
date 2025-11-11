import { action } from "@ember/object";
import { addObserver } from "@ember/object/observers";
import Component from "@glimmer/component";
import { CodeJar } from "codejar";
import { task, timeout } from "ember-concurrency";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import jexl from "highlightjs-jexl/src/languages/jexl";
import isEqual from "lodash.isequal";
import "highlight.js/styles/github.css";

hljs.configure({ ignoreUnescapedHTML: true });

hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("jexl", jexl);

const simplify = (value) => {
  if (typeof value === "object") {
    value = JSON.stringify(value?.unwrap?.() ?? value);
  }

  return value?.replace(/\s/g, "");
};

export default class CfbCodeEditorComponent extends Component {
  _editor = null;
  _lastValue = null;

  get stringValue() {
    if (this.args.language === "json" && typeof this.args.value === "object") {
      return JSON.stringify(
        this.args.value?.unwrap?.() ?? this.args.value,
        null,
        "\t",
      );
    }

    return this.args.value;
  }

  _didChange(value) {
    return !isEqual(this._lastValue, simplify(value));
  }

  @action
  onUpdate(value) {
    if (this.args.language === "json") {
      try {
        value = JSON.parse(value);
      } catch {
        // update value directly
      }
    }

    if (!this._didChange(value)) return;

    this._lastValue = simplify(value);
    this.args.update(value);
  }

  updateEditorContent = task({ restartable: true }, async () => {
    // This function is called everytime `this.args.value` changes. In order to
    // not trigger too many updates, we debounce it for 10ms.
    await timeout(10);

    if (!this._didChange(this.args.value)) return;

    this._lastValue = simplify(this.args.value);
    this._editor.updateCode(this.stringValue, false);
  });

  @action
  didInsertNode(element) {
    this._editor = CodeJar(element, (editor) => {
      editor.removeAttribute("data-highlighted");
      hljs.highlightElement(editor);
    });

    // set initial value
    this._editor.updateCode(this.stringValue, false);
    this._lastValue = simplify(this.args.value);

    // register update method
    this._editor.onUpdate(this.onUpdate);

    // eslint-disable-next-line ember/no-observers
    addObserver(this.args, "value", this.updateEditorContent, "perform");
  }

  @action
  willDestroyNode() {
    this._editor.destroy();
  }
}
