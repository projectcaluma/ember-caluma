import Answer from "@projectcaluma/ember-form/lib/answer";
import Document from "@projectcaluma/ember-form/lib/document";
import Field from "@projectcaluma/ember-form/lib/field";
import Fieldset from "@projectcaluma/ember-form/lib/fieldset";
import Form from "@projectcaluma/ember-form/lib/form";
import Navigation from "@projectcaluma/ember-form/lib/navigation";
import NavigationItem from "@projectcaluma/ember-form/lib/navigation-item";
import Question from "@projectcaluma/ember-form/lib/question";

declare global {
  type StoreModel =
    | Answer
    | Document
    | Field
    | Fieldset
    | Form
    | Navigation
    | NavigationItem
    | Question;

  interface GraphQLNode extends Record<string, unknown> {
    id: string;
    __typename: string;
  }

  interface GraphQLNodeWithOptionalId extends Record<string, unknown> {
    id?: string;
    __typename: string;
  }

  interface FormMeta extends Record<string, unknown> {
    widgetOverride?: string;
  }

  interface RawForm extends GraphQLNode {
    slug: string;
    name: string;
    meta: FormMeta;
    questions: RawQuestion[];
  }

  interface QuestionMeta extends Record<string, unknown> {
    widgetOverride?: string;
    formatValidators?: string[];
    hideLabel?: boolean;
  }

  interface RawQuestion extends GraphQLNode {
    slug: string;
    label: string;
    meta: QuestionMeta;
    isRequired: string;
    isHidden: string;
    calcExpression?: string;

    subForm?: RawForm;
    rowForm?: RawForm;
  }

  interface RawAnswer extends GraphQLNodeWithOptionalId {
    stringValue?: string | null;
    integerValue?: number | null;
    floatValue?: number | null;
    listValue?: string[] | null;
    fileValue?: {
      id: string;
      uploadUrl: string;
      downloadUrl: string;
      metadata: Record<string, unknown>;
      name: string;
    };
    dateValue?: string | null;
    tableValue?: RawDocument[] | Document[] | null;

    question: {
      slug: string;
    };
  }

  interface RawField {
    question: RawQuestion;
    answer?: RawAnswer;
  }

  interface RawFieldset {
    form: RawForm;
    answers: RawAnswer[];
  }

  interface RawWorkItem extends GraphQLNode {
    task: GraphQLNode;
  }

  interface RawDocument extends GraphQLNode {
    workItem: RawWorkItem;
    case: {
      workItems: {
        edges: {
          node: RawWorkItem;
        }[];
      };
    };

    rootForm: RawForm;
    forms: RawForm[];
    answers: RawAnswer[];
  }

  interface JexlContextFormInfo {
    form: string;
    formMeta: Record<string, unknown>;
  }

  interface JexlContextInfo extends JexlContextFormInfo {
    root: JexlContextFormInfo;
    parent: JexlContextFormInfo | null;
  }

  interface DocumentJexlContext {
    null: null;
    form: string;
    info: {
      root: JexlContextFormInfo;
    };
  }

  interface FieldJexlContext {
    info: JexlContextInfo;
  }

  interface OptionConnection {
    edges: { node: { slug: string; label: string; isArchived: boolean } }[];
  }

  interface Option {
    label: string;
    slug: string;
    disabled: boolean;
  }

  interface DynamicOption {
    label: string;
    slug: string;
  }

  type AnswerValue = string | number | string[] | Document[] | null;
  type SerializedAnswerValue = Exclude<AnswerValue, Document[]>;
}
