import { later } from "@ember/runloop";
import { Promise } from "rsvp";

export function resolveAfter(ms) {
  return new Promise((resolve, reject) => {
    try {
      later(resolve, true, ms);
    } catch (err) {
      reject(err);
    }
  });
}

export function rejectAfter(ms, errorMessage) {
  return new Promise((resolve, reject) => {
    try {
      // resolve with a string throws an error for ember-changeset-validations
      later(resolve, errorMessage, ms);
    } catch (err) {
      reject(err);
    }
  });
}

export default { resolveAfter, rejectAfter };
