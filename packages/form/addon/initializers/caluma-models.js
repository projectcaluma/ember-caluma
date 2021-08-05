import Answer from "@projectcaluma/ember-form/lib/answer";
import Document from "@projectcaluma/ember-form/lib/document";
import Field from "@projectcaluma/ember-form/lib/field";
import Fieldset from "@projectcaluma/ember-form/lib/fieldset";
import Form from "@projectcaluma/ember-form/lib/form";
import Navigation, {
  NavigationItem,
} from "@projectcaluma/ember-form/lib/navigation";
import Question from "@projectcaluma/ember-form/lib/question";

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
