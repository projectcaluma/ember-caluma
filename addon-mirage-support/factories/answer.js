import { Factory } from "ember-cli-mirage";
import faker from "faker";
import moment from "moment";

export default Factory.extend({
  afterCreate(answer, server) {
    if (!answer.question) {
      return;
    }

    if (["TEXT", "TEXTAREA"].includes(answer.question.type)) {
      answer.update({ type: "STRING" });

      if (answer.value === undefined) {
        answer.update({ value: faker.lorem.sentence() });
      }
    } else if (answer.question.type === "INTEGER") {
      answer.update({ type: "INTEGER" });

      if (answer.value === undefined) {
        answer.update({
          value: faker.datatype.number({
            min: answer.question.minValue,
            max: answer.question.maxValue,
          }),
        });
      }
    } else if (answer.question.type === "FLOAT") {
      answer.update({ type: "FLOAT" });

      if (answer.value === undefined) {
        answer.update({
          value: faker.datatype.number({
            min: answer.question.minValue,
            max: answer.question.maxValue,
            precision: 0.1,
          }),
        });
      }
    } else if (answer.question.type === "MULTIPLE_CHOICE") {
      answer.update({ type: "LIST" });

      if (answer.value === undefined) {
        answer.update({
          value: [
            faker.random.arrayElement(answer.question.options.models).slug,
          ],
        });
      }
    } else if (answer.question.type === "CHOICE") {
      answer.update({ type: "STRING" });

      if (answer.value === undefined) {
        answer.update({
          value: faker.random.arrayElement(answer.question.options.models).slug,
        });
      }
    } else if (answer.question.type === "FILE") {
      answer.update({ type: "FILE" });

      if (answer.value === undefined) {
        answer.update({
          value: {
            uploadUrl: faker.internet.url,
            downloadUrl: faker.internet.url,
          },
        });
      }
    } else if (answer.question.type === "DATE") {
      answer.update({ type: "DATE" });

      if (answer.value === undefined) {
        const date = faker.date.future();
        answer.update({
          value: moment({
            day: date.getUTCDate(),
            month: date.getUTCMonth(),
            year: date.getUTCFullYear(),
          }).format(moment.HTML5_FMT.DATE),
        });
      }
    } else if (answer.question.type === "TABLE") {
      answer.update({ type: "TABLE" });

      if (answer.value === undefined) {
        const rowForm = server.create("form");

        answer.update({
          rowForm,
          value: [server.create("document", { form: rowForm })],
        });
      }
    }
  },
});
