import { register } from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

export default class extends BaseMock {
  @register("Case")
  handleCase({ __typename }) {
    return { __typename };
  }
}
