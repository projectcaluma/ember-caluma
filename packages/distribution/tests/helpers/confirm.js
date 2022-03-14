import { click, waitFor } from "@ember/test-helpers";

export default async function confirm() {
  await waitFor(".uk-modal.uk-open");
  await click(".uk-modal-footer .uk-button-primary");
}
