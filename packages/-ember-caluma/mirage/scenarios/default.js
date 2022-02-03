import distribution from "@projectcaluma/ember-testing/scenarios/distribution";

export default function (server) {
  server.createList("user", 5);
  const groups = server.createList("group", 5);

  ["suggestions", "federal", "private", "others"].forEach((name) => {
    server.createList("group", 5, {
      type: server.create("group-type", { name }),
    });
  });

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
      server.create("option", { slug: "like-caluma-yes", label: "Yes" }),
      server.create("option", {
        slug: "like-caluma-hell-yes",
        label: "Hell yes",
      }),
      server.create("option", {
        slug: "like-caluma-certainly",
        label: "Certainly",
        isArchived: true,
      }),
    ],
  });
  server.create("question", {
    slug: "short-reason",
    label: "Why so short?",
    formIds: [form.id],
    type: "MULTIPLE_CHOICE",
    isHidden: "'height'|answer > 1.6",
    options: [
      server.create("option", {
        slug: "short-reason-moms-fault",
        label: "Moms fault",
      }),
      server.create("option", {
        slug: "short-reason-dads-fault",
        label: "Dads fault",
      }),
      server.create("option", {
        slug: "short-reason-not-enough-vegetables",
        label: "Not enough vegetables",
      }),
    ],
  });
  server.create("question", {
    slug: "date",
    label: "When?",
    formIds: [form.id],
    type: "DATE",
  });
  server.create("question", {
    slug: "email",
    label: "Email",
    isRequired: "false",
    formIds: [form.id],
    type: "TEXT",
    placeholder: "test@caluma.io",
    formatValidators: [
      server.create("format-validator", {
        slug: "email",
        name: "Email",
        regex: "(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$)",
        errorMsg: "Please enter a valid email address",
      }),
    ],
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
    // Switch `caseId` with `workItemId` to test behaviour with a document
    // directly attached to a work item instead of a case workItemId:
    // server.create("work-item").id,
    caseId: server.create("case", {
      workItemIds: [
        server.create("work-item", {
          taskId: server.create("task", {
            type: "COMPLETE_WORKFLOW_FORM",
          }).id,
        }).id,
      ],
    }).id,
    formId: form.id,
  });

  server.createList("work-item", 50);

  distribution(server, groups);
}
