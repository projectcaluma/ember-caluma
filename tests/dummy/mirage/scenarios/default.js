export default function(server) {
  const form = server.create("form");

  server.create("question", {
    slug: "name",
    label: "What is your name?",
    formIds: [form.id],
    type: "TEXT",
    maxLength: null
  });
  server.create("question", {
    slug: "description",
    label: "Describe yourself.",
    formIds: [form.id],
    type: "TEXTAREA",
    maxLength: 255
  });
  server.create("question", {
    slug: "age",
    label: "What is your age?",
    formIds: [form.id],
    type: "INTEGER",
    minValue: 0,
    maxValue: null
  });
  server.create("question", {
    slug: "height",
    label: "How tall are you in meters?",
    formIds: [form.id],
    type: "FLOAT",
    minValue: 0,
    maxValue: null,
    isHidden: "'age'|answer < 18"
  });
  server.create("question", {
    slug: "like-caluma",
    label: "Do you like Caluma?",
    type: "CHOICE",
    formIds: [form.id],
    options: [
      server.create("option", { label: "Yes" }),
      server.create("option", { label: "Hell yes" })
    ]
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
      server.create("option", { label: "Not enough vegetables" })
    ]
  });
  server.create("question", {
    slug: "date",
    label: "When?",
    formIds: [form.id],
    type: "DATE"
  });
  server.create("question", {
    slug: "dummy",
    label: "Dummy widget",
    formIds: [form.id],
    type: "TEXT",
    meta: { widgetOverride: "dummy-one" }
  });

  server.create("document", { formId: form.id });
}
