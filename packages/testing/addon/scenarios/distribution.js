import faker from "faker";
import moment from "moment";

export function createBlueprint(server) {
  const inquiryForm = server.create("form", { slug: "inquiry" });
  const inquiryAnswerForm = server.create("form", { slug: "inquiry-answer" });

  server.create("question", {
    slug: "inquiry-remark",
    label: "Remark",
    formIds: [inquiryForm.id],
    type: "TEXTAREA",
  });
  server.create("question", {
    slug: "inquiry-deadline",
    label: "Deadline",
    formIds: [inquiryForm.id],
    type: "DATE",
  });

  server.create("question", {
    slug: "inquiry-answer-status",
    type: "CHOICE",
    formIds: [inquiryAnswerForm.id],
    options: [
      server.create("option", {
        slug: "inquiry-answer-status-positive",
        label: "Positive",
      }),
      server.create("option", {
        slug: "inquiry-answer-status-negative",
        label: "Negative",
      }),
      server.create("option", {
        slug: "inquiry-answer-status-needs-interaction",
        label: "Needs interaction",
      }),
    ],
  });
  server.create("question", {
    slug: "inquiry-answer-reason",
    label: "Reason",
    type: "TEXTAREA",
    formIds: [inquiryAnswerForm.id],
  });

  server.create("task", { slug: "inquiry" });
}

export function createInquiry(
  server,
  distributionCase,
  { from, to, remark, deadline },
  workItemAttrs = {}
) {
  const form = server.schema.forms.findBy({ slug: "inquiry" });
  const document = server.create("document", { form });

  server.create("answer", {
    document,
    question: server.schema.questions.findBy({
      slug: "inquiry-remark",
    }),
    value: remark ?? faker.lorem.paragraph(),
  });

  server.create("answer", {
    document,
    question: server.schema.questions.findBy({
      slug: "inquiry-deadline",
    }),
    value: deadline ?? faker.date.future(),
  });

  return server.create("work-item", {
    task: server.schema.tasks.findBy({ slug: "inquiry" }),
    document,
    status: "SUSPENDED",
    case: distributionCase,
    addressedGroups: [to.id],
    controllingGroups: [from.id],
    ...workItemAttrs,
  });
}

export function sendInquiry(server, { inquiry }) {
  inquiry.update({
    status: "READY",
    childCase: server.create("case", {
      status: "RUNNING",
      document: server.create("document", {
        form: server.schema.forms.findBy({ slug: "inquiry-answer" }),
      }),
    }),
  });

  return inquiry;
}

export function answerInquiry(server, { inquiry, status, reason }) {
  if (inquiry.status !== "READY") {
    inquiry = sendInquiry(server, { inquiry });
  }

  server.create("answer", {
    document: inquiry.childCase.document,
    question: server.schema.questions.findBy({
      slug: "inquiry-answer-status",
    }),
    value: status,
  });

  server.create("answer", {
    document: inquiry.childCase.document,
    question: server.schema.questions.findBy({
      slug: "inquiry-answer-reason",
    }),
    value: reason ?? faker.lorem.paragraph(),
  });

  inquiry.update({ status: "COMPLETED" });
  inquiry.childCase.update({
    status: "COMPLETED",
    closedAt: faker.date.recent(),
  });

  return inquiry;
}

export default function (server, groups) {
  const distributionCase = server.create("case", {
    workflow: server.create("workflow", { slug: "distribution" }),
  });

  const g = groups[0];
  const g1 = groups[1];
  const g2 = groups[2];
  const g3 = groups[3];
  const g4 = groups[4];

  const create = (...args) => createInquiry(server, distributionCase, ...args);
  const send = (...args) => sendInquiry(server, ...args);
  const answer = (...args) => answerInquiry(server, ...args);

  createBlueprint(server);

  // controlling
  create({ from: g, to: g1 });
  send({
    inquiry: create({
      from: g,
      to: g2,
      deadline: faker.date.past(),
    }),
  });
  answer({
    inquiry: create({
      from: g,
      to: g3,
      deadline: faker.date.past(),
    }),
    status: "inquiry-answer-status-needs-interaction",
  });
  // "override" third controlling inquiry
  answer({
    inquiry: create({ from: g, to: g3 }, { createdAt: faker.date.recent() }),
    status: "inquiry-answer-status-positive",
  });

  // addressed
  answer({
    inquiry: create({ from: g2, to: g }),
    status: "inquiry-answer-status-needs-interaction",
  });
  // "override" first addressed inquiry
  send({
    inquiry: create(
      {
        from: g2,
        to: g,
        deadline: moment.utc().add(2, "days").toDate(),
      },
      { createdAt: faker.date.recent() }
    ),
  });
  answer({
    inquiry: create({ from: g4, to: g }),
    status: "inquiry-answer-status-negative",
  });

  // more
  answer({
    inquiry: create({ from: g2, to: g3 }),
    status: "inquiry-answer-status-needs-interaction",
  });
  answer({
    inquiry: create({ from: g3, to: g4 }),
    status: "inquiry-answer-status-positive",
  });
}
