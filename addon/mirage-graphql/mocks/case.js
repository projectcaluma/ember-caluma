import BaseMock from "ember-caluma-form-builder/mirage-graphql/mocks/base";
import { register } from "ember-caluma-form-builder/mirage-graphql";

export default class extends BaseMock {
  @register("Case")
  handleCase({ __typename }) {
    return { __typename };
  }
}
