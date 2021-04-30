import Component from '@glimmer/component';
import {queryManager} from "ember-apollo-client";
import {task} from "ember-concurrency-decorators";
import getFormsWithQuestionQuery from "ember-caluma/gql/queries/get-forms-with-question.graphql";
import getQuestionsWithSubformQuery from "ember-caluma/gql/queries/get-questions-with-subform.graphql";

export default class DependentsTreeComponent extends Component {
  @queryManager apollo

  /**
   * Return all questions that have a form input
   * @param slug of the searched subForm
   * @returns {Promise<Object[]>}
   */
  async getQuestionsWithSubForm(slug) {
    const {questions} = await this.apollo.query({
      query: getQuestionsWithSubformQuery,
      variables: {slug: slug},
    });

    return questions.edges.map(question => question.node);
  }

  /**
   * Return an array of forms that contain the given questions
   * @param slugs of the searched questions
   * @returns {Promise<Object[]>}
   */
  async getFormsWithQuestion(slugs) {
    const {forms} = await this.apollo.query({
      query: getFormsWithQuestionQuery,
      variables: {slugs: slugs},
    });

    return forms.edges.map(form => form.node)
  }

  /**
   * Get the parent-forms for the current form
   * @param slug
   * @returns {Promise<Object[]>}
   */
  async getParentForms(slug) {
    const questions = await this.getQuestionsWithSubForm(slug);
    // If no questions have the current form as it's subForm return undefined
    if (questions.length === 0) return undefined;
    const forms = await this.getFormsWithQuestion(questions.map(q => q.slug));
    return forms;
  }

  /**
   * Get and add the parent forms to the given form
   * @param form for which the parents should be fetched
   * @returns {Promise<Object>}
   */
  async buildDependentsTree(form) {
    const shallowParentForms = await this.getParentForms(form.slug);

    // If the form isn't included inside any other forms return the form as is.
    if (shallowParentForms === undefined || shallowParentForms.length === 0) return form

    const parentForms = await Promise.all(
      shallowParentForms.map(async (parent) => {
        return await this.buildDependentsTree(parent);
      })
    )

    return {
      ...form,
      parents: parentForms.map(parent => ({...parent, child: form})),
    };
  }


  transformDependentsTree(root) {

  }

  @task
  * data() {
    const form = {
      name: this.args.form.name,
      slug: this.args.form.slug,
    }
    const res = yield this.buildDependentsTree(form);
    console.log("Test");
    console.log(res);
    console.log(this.invertForm(res))
  }
}
