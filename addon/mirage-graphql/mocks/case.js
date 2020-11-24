import { register } from "ember-caluma/mirage-graphql";
import BaseMock from "ember-caluma/mirage-graphql/mocks/base";

export default class extends BaseMock {
  @register("Case")
  handleCase({ __typename }) {
    return { __typename };
  }
}
