import BaseMock from "ember-caluma/mirage-graphql/mocks/base";
import { register } from "ember-caluma/mirage-graphql";

export default class extends BaseMock {
  @register("Case")
  handleCase({ __typename }) {
    return { __typename };
  }
}
