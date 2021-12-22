import Service from "@ember/service";

export default class ValidatorServiceStub extends Service {
  async validate() {
    return [true];
  }
}
