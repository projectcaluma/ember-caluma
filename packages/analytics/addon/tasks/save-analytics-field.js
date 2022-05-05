import saveAnalyticsFieldMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-field.graphql";

export function* saveAnalyticsField(input) {
  try {
    yield this.apollo.mutate({
      mutation: saveAnalyticsFieldMutation,
      variables: { input },
    });
    this.visible = false;
  } catch (error) {
    console.error(error);
    this.notification.danger(
      this.intl.t("caluma.analytics.notification.create-error")
    );
  }
}
