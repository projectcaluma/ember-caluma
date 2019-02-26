import { reads } from "@ember/object/computed";

/**
 * Shortcut to read the last successful value of a task
 *
 * @function lastValue
 * @param {String} taskName Name of the task
 * @return {Function} Computed property
 */
export const lastValue = taskName => reads(`${taskName}.lastSuccessful.value`);

export default { lastValue };
