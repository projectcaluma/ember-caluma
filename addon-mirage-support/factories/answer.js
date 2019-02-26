import { Factory, faker } from "ember-cli-mirage";

export default Factory.extend({
  afterCreate(answer) {
    if (!answer.question) {
      return;
    }

    if (["TEXT", "TEXTAREA"].includes(answer.question.type)) {
      answer.update({
        type: "STRING"
      });

      if (answer.value === undefined) {
        answer.update({
          value: faker.lorem.sentence()
        });
      }
    } else if (answer.question.type === "INTEGER") {
      answer.update({
        type: "INTEGER"
      });

      if (answer.value === undefined) {
        answer.update({
          value: faker.random.number({
            min: answer.question.minValue,
            max: answer.question.maxValue
          })
        });
      }
    } else if (answer.question.type === "FLOAT") {
      answer.update({
        type: "FLOAT"
      });

      if (answer.value === undefined) {
        answer.update({
          value: faker.random.number({
            min: answer.question.minValue,
            max: answer.question.maxValue,
            precision: 0.1
          })
        });
      }
    } else if (answer.question.type === "MULTIPLE_CHOICE") {
      answer.update({
        type: "LIST"
      });

      if (answer.value === undefined) {
        answer.update({
          value: [
            faker.random.arrayElement(answer.question.options.models).slug
          ]
        });
      }
    } else if (answer.question.type === "CHOICE") {
      answer.update({
        type: "STRING"
      });

      if (answer.value === undefined) {
        answer.update({
          value: faker.random.arrayElement(answer.question.options.models).slug
        });
      }
    }
  }
});
