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
      parents: parentForms.map(parent => ({...parent, childSlug: form.slug})),
    };
  }

  /**
   * Flatt
   * @param root
   * @returns {*[]}
   */
  flattenForms(root) {
    let forms = [root];
    // Flatten root
    if (root.parents) {
      const flattendForms = root.parents
        .map(parent => this.flattenForms(parent))
        .flat();
      forms = forms.concat(flattendForms);
    }

    return forms;
  }

  /**
   * Get the child form of the form
   * @param form for which the child should be fetched
   * @param forms that are available
   * @returns Object
   */
  getChild(form, forms) {
    let child = forms.find(c => c.slug === form.childSlug);
    if (child !== undefined) {
      child = this.getChild(child, forms);
    }

    return {
      name: form.name,
      slug: form.slug,
      child
    }
  }

  getFormTree(forms) {
    const flattendForms = this.flattenForms(forms);
    // all forms that don't have a parent
    const outerForms = flattendForms.filter(form => form.parents === undefined)
    return outerForms.map(c => this.getChild(c, flattendForms))
  }

  @task
  * data() {
    const form = {
      name: this.args.form.name,
      slug: this.args.form.slug,
    }
    const res = yield this.buildDependentsTree(form);
    return this.getFormTree(res);
  }
}
