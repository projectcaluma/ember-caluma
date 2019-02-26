import { helper } from "@ember/component/helper";

export function atob(str) {
  try {
    return window.atob(str).split(":")[1];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Attempted to decode", str, "as base64");
    return str;
  }
}

export default helper(function([str]) {
  return atob(str);
});
