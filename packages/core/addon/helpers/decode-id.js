import { helper } from "@ember/component/helper";
import { warn } from "@ember/debug";

export function decodeId(str) {
  try {
    return window.atob(str).split(":")[1];
  } catch (e) {
    warn(`Attempted to decode ${str} as base64 but failed`, {
      id: "ember-caluma.decode-id",
    });

    return str;
  }
}

export default helper(function ([str]) {
  return decodeId(str);
});
