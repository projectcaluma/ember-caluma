import { setOwner } from "@ember/application";
import { inject as service } from "@ember/service";
import { macroCondition, isTesting, importSync } from "@embroider/macros";
import { queryManager } from "ember-apollo-client";
import {
  validatePresence,
  validateLength,
  validateFormat,
} from "ember-changeset-validations/validators";
import { timeout, restartableTask, didCancel } from "ember-concurrency";

import checkFormSlugQuery from "@projectcaluma/ember-form-builder/gql/queries/check-form-slug.graphql";
import checkOptionSlugQuery from "@projectcaluma/ember-form-builder/gql/queries/check-option-slug.graphql";
import checkQuestionSlugQuery from "@projectcaluma/ember-form-builder/gql/queries/check-question-slug.graphql";

export class SlugUniquenessValidator {
  @service intl;

  @queryManager apollo;

  queries = {
    form: checkFormSlugQuery,
    question: checkQuestionSlugQuery,
    option: checkOptionSlugQuery,
  };

  cache = {
    form: {},
    question: {},
    option: {},
  };

  constructor(type) {
    this.type = type;
  }

  async validate(key, newValue, oldValue, changes, context) {
    const application = importSync(
      "@projectcaluma/ember-form-builder/-private/application"
    ).default;

    setOwner(this, application.instance);

    // If the object already exists or the slug is empty we don't need to check
    // for uniqueness
    if (context.id || !newValue) {
      return true;
    }

    let isUnique = this.cache[this.type][newValue];

    if (isUnique === undefined) {
      try {
        // Uniqueness of the slug was not cached, we need to check with the API
        isUnique = await this._validate.perform(newValue, context);
      } catch (error) {
        // Validation task was canceled because we debounce it so we don't cause
        // too many requests on input. This cancelation means that there is
        // another validation ongoing which will then return the needed value.
        // For now, we can just mark it as valid.
        isUnique = didCancel(error);
      }
    }

    return (
      isUnique ||
      this.intl.t(`caluma.form-builder.validations.${this.type}.slug`)
    );
  }

  @restartableTask
  *_validate(slug, context) {
    /* istanbul ignore next */
    if (macroCondition(isTesting())) {
      // no timeout
    } else {
      yield timeout(500);
    }

    let count = Infinity;

    try {
      const response = yield this.apollo.query({
        query: this.queries[this.type],
        variables:
          this.type === "option"
            ? { slug, question: context.question }
            : { slug },
      });

      if (this.type === "form") {
        count = response.allForms.totalCount;
      } else if (this.type === "question") {
        count = response.allQuestions.totalCount;
      } else if (this.type === "option") {
        count = response.allQuestions.edges[0].node.options.totalCount;
      }
    } catch (error) {
      // do nothing, which will result in count being Infinity which will return
      // a validation error
    }

    const isUnique = count === 0;

    this.cache[this.type][slug] = isUnique;

    return isUnique;
  }
}

export default function slugValidation({ type, maxLength = 127 }) {
  return [
    validatePresence(true),
    validateLength({ max: maxLength }),
    validateFormat({ regex: /^[a-z0-9-]+$/ }),
    new SlugUniquenessValidator(type),
  ];
}
