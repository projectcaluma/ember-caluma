import { deprecate } from "@ember/application/deprecations";
import { helper } from "@ember/component/helper";

import { decodeId } from "ember-caluma/helpers/decode-id";

export function atob(str) {
  deprecate(
    'DEPRECATED: Using the `atob` helper is deprecated. Instead, use the new `decodeId` helper: `import { decodeId } from "ember-caluma/helpers/decode-id";`.',
    false,
    { id: "ember-caluma.atob-in-code", until: "1.0.0" }
  );

  return decodeId(str);
}

export default helper(function ([str]) {
  deprecate(
    "DEPRECATED: Using the `{{atob}}` helper is deprecated. Instead, use the new `{{decodeId}}` helper.",
    false,
    { id: "ember-caluma.atob-in-template", until: "1.0.0" }
  );

  return decodeId(str);
});
