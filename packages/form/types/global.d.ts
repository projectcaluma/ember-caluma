declare module "@projectcaluma/ember-form/templates/*" {
  import { TemplateFactory } from "htmlbars-inline-precompile";
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module "*.graphql" {
  const doc: import("graphql").DocumentNode;
  export default doc;
}
