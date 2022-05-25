import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";

export default function* (input) {
  try {
    const mutation = yield this.apollo.mutate({
      mutation: saveAnalyticsFieldMutation,
      variables: { input },
    });
    this.notification.success(
      this.intl.t("caluma.analytics.notification.field-saved")
    );
    return mutation;
  } catch (error) {
    console.error(error);
    this.notification.danger(
      this.intl.t("caluma.analytics.notification.create-error")
    );
  }
}
