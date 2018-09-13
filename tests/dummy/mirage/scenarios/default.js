import { faker } from "ember-cli-mirage";

export default function(server) {
  const forms = server.createList("form", 5);
  const questions = server.createList("question", 20);

  forms.forEach(form => {
    const begin = faker.random.number({ min: 0, max: questions.length - 1 });
    const end = faker.random.number({ min: begin + 1, max: questions.length });

    form.update({
      questionIds: questions.slice(begin, end).map(({ id }) => id)
    });
  });
}
