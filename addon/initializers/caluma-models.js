import Answer from "ember-caluma/lib/answer";
import Document from "ember-caluma/lib/document";
import Field from "ember-caluma/lib/field";
import Fieldset from "ember-caluma/lib/fieldset";
import Form from "ember-caluma/lib/form";
import Navigation, { NavigationItem } from "ember-caluma/lib/navigation";
import Question from "ember-caluma/lib/question";

export function initialize(application) {
  application.register("caluma-model:document", Document);
  application.register("caluma-model:question", Question);
  application.register("caluma-model:form", Form);
  application.register("caluma-model:fieldset", Fieldset);
  application.register("caluma-model:answer", Answer);
  application.register("caluma-model:field", Field);
  application.register("caluma-model:navigation", Navigation);
  application.register("caluma-model:navigation-item", NavigationItem);
}

export default {
  initialize,
};
