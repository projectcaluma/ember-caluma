import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";

export default async function (input) {
  try {
    const mutation = await this.apollo.mutate({
      mutation: saveAnalyticsFieldMutation,
      variables: { input },
    });
    this.notification.success(
      this.intl.t("caluma.analytics.notification.field-saved"),
    );
    return mutation;
  } catch (error) {
    console.error(error);
    this.notification.danger(
      this.intl.t("caluma.analytics.notification.create-error"),
    );
  }
}
