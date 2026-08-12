import CalumaOptionsService from "@projectcaluma/ember-core/services/caluma-options";

export default class CustomCalumaOptionsService extends CalumaOptionsService {
  distribution = {
    inquiry: {
      answer: {
        statusMapping: {
          // Add mapping for custom status in order for the rendering to work
          // in tests
          "inquiry-answer-status-custom": {
            slug: "inquiry-answer-status-custom",
            color: "success",
            icon: "database",
          },
        },
      },
    },
  };
}
