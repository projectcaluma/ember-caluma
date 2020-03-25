import Service from "@ember/service";

export default Service.extend({
  async validate() {
    return [true];
  },
});
