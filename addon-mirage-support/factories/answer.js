import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  afterCreate(answer) {
    if (!answer.question) {
      return;
    }

    if (["TEXT", "TEXTAREA"].includes(answer.question.type)) {
      answer.update({
        type: "STRING",
      });

      if (answer.value === undefined) {
        answer.update({
          value: faker.lorem.sentence(),
        });
      }
    } else if (answer.question.type === "INTEGER") {
      answer.update({
        type: "INTEGER",
      });

      if (answer.value === undefined) {
        answer.update({
          value: faker.random.number({
            min: answer.question.minValue,
            max: answer.question.maxValue,
          }),
        });
      }
    } else if (answer.question.type === "FLOAT") {
      answer.update({
        type: "FLOAT",
      });

      if (answer.value === undefined) {
        answer.update({
          value: faker.random.number({
            min: answer.question.minValue,
            max: answer.question.maxValue,
            precision: 0.1,
          }),
        });
      }
    } else if (answer.question.type === "MULTIPLE_CHOICE") {
      answer.update({
        type: "LIST",
      });

      if (answer.value === undefined) {
        answer.update({
          value: [
            faker.random.arrayElement(answer.question.options.models).slug,
          ],
        });
      }
    } else if (answer.question.type === "CHOICE") {
      answer.update({
        type: "STRING",
      });

      if (answer.value === undefined) {
        answer.update({
          value: faker.random.arrayElement(answer.question.options.models).slug,
        });
      }
    } else if (answer.question.type === "FILE") {
      answer.update({
        type: "FILE",
      });

      if (answer.value === undefined) {
        answer.update({
          value: {
            uploadUrl: faker.internet.url,
            downloadUrl: faker.internet.url,
          },
        });
      }
    } else if (answer.question.type === "DATE") {
      answer.update({
        type: "DATE",
      });

      if (answer.value === undefined) {
        const date = faker.date.future();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        answer.update({
          value: `${year}-${month}-${day}`,
        });
      }
    }
  },
});
