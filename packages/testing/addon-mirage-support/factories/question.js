import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  type: "TEXT",

  slug: (i) => `question-${i + 1}`,
  label: () => `${faker.lorem.sentence().replace(/\.$/, "")}?`,
  isRequired: () => faker.datatype.boolean().toString(),
  isHidden: "false",
  isArchived: false,
  meta: () => ({}),

  afterCreate(question, server) {
    if (["TEXT", "TEXTAREA"].includes(question.type)) {
      if (question.maxLength === undefined) {
        question.update({
          maxLength: faker.datatype.number({ min: 1, max: 255 }),
        });
      }
      if (question.minLength === undefined) {
        question.update({
          minLength: faker.datatype.number({ min: 1, max: 10 }),
        });
      }
    } else if (["INTEGER", "FLOAT"].includes(question.type)) {
      if (question.minValue === undefined) {
        question.update({
          minValue: faker.datatype.number({ min: 1, max: 100 }),
        });
      }

      if (question.maxValue === undefined) {
        question.update({
          maxValue: faker.datatype.number({
            min: question.minValue + 1,
            max: 1000,
          }),
        });
      }
    } else if (["MULTIPLE_CHOICE", "CHOICE"].includes(question.type)) {
      if (question.optionIds.length === 0) {
        const options = server.createList("option", 3);

        options.forEach((option) =>
          option.update({ slug: `${question.slug}-${option.slug}` })
        );

        question.update({ optionIds: options.map(({ id }) => id) });
      }
    } else if (question.type === "TABLE") {
      if (question.rowForm === undefined) {
        const form = server.create("form");
        question.update({
          rowForm: {
            slug: form.slug,
            name: form.name,
          },
        });
      }
    } else if (question.type === "FORM") {
      if (question.subForm === undefined) {
        const form = server.create("form");
        question.update({
          subForm: {
            slug: form.slug,
            name: form.name,
          },
        });
      }
    } else if (question.type === "STATIC") {
      if (question.staticContent === undefined) {
        question.update({
          staticContent: (i) => `static-${i + 1}`,
        });
      }
    }
  },
});
