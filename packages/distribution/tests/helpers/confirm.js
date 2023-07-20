import { click, waitUntil } from "@ember/test-helpers";
import UIkit from "uikit";

function getModal() {
  return UIkit.modal(".uk-modal.uk-open");
}

export default async function confirm() {
  // Wait until the confirm modal is in the DOM
  await waitUntil(getModal);

  // Wait until the confirm modal is done animating
  const modal = getModal();
  await waitUntil(() => !modal.hasAnimation);

  // Click confirm button
  await click(
    modal.$el.querySelector(".uk-modal-footer .uk-button.uk-button-primary"),
  );
}
