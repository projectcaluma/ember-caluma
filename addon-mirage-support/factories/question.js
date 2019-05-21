import { Factory, faker } from "ember-cli-mirage";

const TYPES = [
  "TEXT",
  "TEXTAREA",
  "INTEGER",
  "FLOAT",
  "MULTIPLE_CHOICE",
  "CHOICE",
  "TABLE",
  "FILE",
  "STATIC",
  "DATE"
];

export default Factory.extend({
  slug: i => `question-${i + 1}`,
  label: () => `${faker.lorem.sentence().replace(/\.$/, "")}?`,
  type: faker.list.random(...TYPES),
  isRequired: () => faker.random.boolean().toString(),
  isHidden: "false",
  isArchived: false,
  meta: () => ({}),

  afterCreate(question, server) {
    if (["TEXT", "TEXTAREA"].includes(question.type)) {
      if (question.maxLength === undefined) {
        question.update({
          maxLength: faker.random.number({ min: 1, max: 255 })
        });
      }
    } else if (["INTEGER", "FLOAT"].includes(question.type)) {
      if (question.minValue === undefined) {
        question.update({
          minValue: faker.random.number({ min: 1, max: 100 })
        });
      }

      if (question.maxValue === undefined) {
        question.update({
          maxValue: faker.random.number({
            min: question.minValue + 1,
            max: 1000
          })
        });
      }
    } else if (["MULTIPLE_CHOICE", "CHOICE"].includes(question.type)) {
      if (question.optionIds.length === 0) {
        const options = server.createList("option", 3);

        options.forEach(option =>
          option.update({ slug: `${question.slug}-${option.slug}` })
        );

        question.update({ optionIds: options.map(({ id }) => id) });
      }
    } else if (question.type === "TABLE") {
      if (question.rowForm === undefined) {
        question.update({
          rowForm: i => `subform-${i + 1}`
        });
      }
    } else if (question.type === "STATIC") {
      if (question.staticContent === undefined) {
        question.update({
          staticContent: i => `static-${i + 1}`
        });
      }
    }
  }
});
