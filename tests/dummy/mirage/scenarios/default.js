export default function(server) {
  const forms = server.createList("form", 5);
  const questions = server.createList("question", 5);

  server.db.questions.update({ formIds: forms.map(({ id }) => id) });
  server.db.forms.update({ questionIds: questions.map(({ id }) => id) });
}
