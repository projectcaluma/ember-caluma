export default function (server) {
  server.createList("user", 5);
  server.createList("group", 5);

  const form = server.create("form");

  server.create("question", {
    slug: "name",
    label: "What is your name?",
    formIds: [form.id],
    type: "TEXT",
    maxLength: null,
  });
  server.create("question", {
    slug: "description",
    label: "Describe yourself:",
    formIds: [form.id],
    type: "TEXTAREA",
    maxLength: 50,
    minLength: 5,
  });
  server.create("question", {
    slug: "age",
    label: "What is your age?",
    infoText: null,
    formIds: [form.id],
    type: "INTEGER",
    minValue: 0,
    maxValue: null,
  });
  server.create("question", {
    slug: "height",
    label: "How tall are you in meters?",
    formIds: [form.id],
    type: "FLOAT",
    minValue: 0,
    maxValue: null,
    isHidden: "'age'|answer < 18",
  });
  server.create("question", {
    slug: "like-caluma",
    label: "Do you like Caluma?",
    infoText: null,
    type: "CHOICE",
    formIds: [form.id],
    options: [
      server.create("option", { label: "Yes" }),
      server.create("option", { label: "Hell yes" }),
      server.create("option", { label: "Certainly", isArchived: true }),
    ],
  });
  server.create("question", {
    slug: "short-reason",
    label: "Why so short?",
    formIds: [form.id],
    type: "MULTIPLE_CHOICE",
    isHidden: "'height'|answer > 1.6",
    options: [
      server.create("option", { label: "Moms fault" }),
      server.create("option", { label: "Dads fault" }),
      server.create("option", { label: "Not enough vegetables" }),
    ],
  });
  server.create("question", {
    slug: "date",
    label: "When?",
    formIds: [form.id],
    type: "DATE",
  });
  server.create("question", {
    slug: "dummy",
    label: "Dummy widget",
    isRequired: "false",
    infoText: null,
    formIds: [form.id],
    type: "TEXT",
    meta: { widgetOverride: "dummy-one" },
  });
  server.create("question", {
    slug: "submit",
    label: "Submit",
    isRequired: "false",
    infoText: "Do you really want to submit this form?",
    formIds: [form.id],
    type: "ACTION_BUTTON",
    color: "SECONDARY",
  });

  server.create("document", {
    workItemId: server.create("work-item").id,
    formId: form.id,
  });

  server.createList("work-item", 20);
  server.createList("format-validator", 3);
}
