import faker from "@faker-js/faker";
import moment from "moment";

export function createBlueprint(server) {
  const inquiryForm = server.create("form", { slug: "inquiry" });
  const inquiryAnswerForm = server.create("form", { slug: "inquiry-answer" });

  server.create("question", {
    slug: "inquiry-remark",
    label: "Remark",
    isRequired: "true",
    maxLength: 9999,
    minLength: 0,
    formIds: [inquiryForm.id],
    type: "TEXTAREA",
  });
  server.create("question", {
    slug: "inquiry-deadline",
    label: "Deadline",
    isRequired: "true",
    formIds: [inquiryForm.id],
    type: "DATE",
  });

  server.create("question", {
    slug: "inquiry-answer-status",
    type: "CHOICE",
    formIds: [inquiryAnswerForm.id],
    isRequired: "true",
    label: "Status",
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
    isRequired: "true",
    maxLength: 9999,
    minLength: 0,
    label: "Reason",
    type: "TEXTAREA",
    formIds: [inquiryAnswerForm.id],
  });

  server.create("workflow", { slug: "distribution" });
  server.create("workflow", { slug: "inquiry" });

  server.create("task", { slug: "create-inquiry" });
  server.create("task", { slug: "complete-distribution" });
  server.create("task", { slug: "inquiry" });
  server.create("task", {
    slug: "compose-inquiry-answer",
    type: "COMPLETE_WORKFLOW_FORM",
  });
  server.create("task", { slug: "confirm-inquiry-answer" });
  server.create("task", { slug: "revise-inquiry-answer" });
  server.create("task", {
    slug: "adjust-inquiry-answer",
    type: "COMPLETE_WORKFLOW_FORM",
  });
}

export function createInquiry(
  server,
  distributionCase,
  { from, to, remark, deadline },
  workItemAttrs = {}
) {
  const document = server.create("document", { formId: "inquiry" });

  server.create("answer", {
    document,
    questionId: "inquiry-remark",
    value: remark ?? faker.lorem.paragraph(),
  });

  server.create("answer", {
    document,
    questionId: "inquiry-deadline",
    value: deadline ?? faker.date.future(),
  });

  return server.create("work-item", {
    taskId: "inquiry",
    document,
    status: "SUSPENDED",
    case: distributionCase,
    addressedGroups: [to.id],
    controllingGroups: [from.id],
    ...workItemAttrs,
  });
}

export function sendInquiry(server, { inquiry }) {
  const childCase = server.create("case", {
    status: "RUNNING",
    workflowId: "inquiry",
    document: server.create("document", { formId: "inquiry-answer" }),
  });

  server.create("work-item", {
    taskId: "compose-inquiry-answer",
    status: "READY",
    case: childCase,
    addressedGroups: inquiry.addressedGroups,
  });

  inquiry.update({ status: "READY", childCase });

  return inquiry;
}

export function answerInquiry(server, { inquiry, status, reason }) {
  if (inquiry.status !== "READY") {
    inquiry = sendInquiry(server, { inquiry });
  }

  server.create("answer", {
    document: inquiry.childCase.document,
    questionId: "inquiry-answer-status",
    value: status,
  });

  server.create("answer", {
    document: inquiry.childCase.document,
    questionId: "inquiry-answer-reason",
    value: reason ?? faker.lorem.paragraph(),
  });

  inquiry.childCase.workItems
    .filter((workItem) => workItem.taskId === "compose-inquiry-answer")
    .update({ status: "COMPLETED" });
  server.create("work-item", {
    taskId: "confirm-inquiry-answer",
    status: "READY",
    case: inquiry.childCase,
    addressedGroups: inquiry.addressedGroups,
  });
  server.create("work-item", {
    taskId: "revise-inquiry-answer",
    status: "READY",
    case: inquiry.childCase,
    addressedGroups: inquiry.addressedGroups,
  });

  return inquiry;
}

export function confirmInquiry({ inquiry }) {
  inquiry.update({ status: "COMPLETED" });
  inquiry.childCase.update({
    status: "COMPLETED",
    closedAt: faker.date.recent(),
  });
  inquiry.childCase.workItems
    .filter((workItem) => workItem.taskId === "confirm-inquiry-answer")
    .update({ status: "COMPLETED" });
  inquiry.childCase.workItems
    .filter((workItem) => workItem.taskId === "revise-inquiry-answer")
    .update({ status: "CANCELED" });

  return inquiry;
}

export function reviseInquiry(server, { inquiry }) {
  server.create("work-item", {
    taskId: "adjust-inquiry-answer",
    status: "READY",
    case: inquiry.childCase,
    addressedGroups: inquiry.addressedGroups,
  });
  inquiry.childCase.workItems
    .filter((workItem) => workItem.taskId === "confirm-inquiry-answer")
    .update({ status: "CANCELED" });
  inquiry.childCase.workItems
    .filter((workItem) => workItem.taskId === "revise-inquiry-answer")
    .update({ status: "COMPLETED" });

  return inquiry;
}

export function createCase(server, { group }) {
  const distributionCase = server.create("case", {
    status: "RUNNING",
    workflowId: "distribution",
  });

  server.create("work-item", {
    case: distributionCase,
    taskId: "create-inquiry",
    status: "READY",
    addressedGroups: [group.id],
  });

  server.create("work-item", {
    case: distributionCase,
    taskId: "complete-distribution",
    status: "READY",
    addressedGroups: [group.id],
  });

  return distributionCase;
}

export default function (server, groups) {
  createBlueprint(server);

  const g = groups[0];
  const g1 = groups[1];
  const g2 = groups[2];
  const g3 = groups[3];
  const g4 = groups[4];

  const create = (...args) => createInquiry(server, distributionCase, ...args);
  const send = (...args) => sendInquiry(server, ...args);
  const answer = (...args) => answerInquiry(server, ...args);
  const confirm = (...args) => confirmInquiry(...args);
  const revise = (...args) => reviseInquiry(server, ...args);

  const distributionCase = createCase(server, { group: g1 });

  server.create("work-item", {
    taskId: "create-inquiry",
    status: "READY",
    addressedGroups: [g.id],
  });

  // controlling
  create({ from: g, to: g1 });
  send({
    inquiry: create({
      from: g,
      to: g2,
      deadline: faker.date.past(),
    }),
  });
  confirm({
    inquiry: answer({
      inquiry: create({
        from: g,
        to: g3,
        deadline: faker.date.past(),
      }),
      status: "inquiry-answer-status-needs-interaction",
    }),
  });

  // "override" third controlling inquiry
  confirm({
    inquiry: answer({
      inquiry: create({ from: g, to: g3 }, { createdAt: faker.date.recent() }),
      status: "inquiry-answer-status-positive",
    }),
  });

  // addressed
  confirm({
    inquiry: answer({
      inquiry: create({ from: g2, to: g }),
      status: "inquiry-answer-status-needs-interaction",
    }),
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
  confirm({
    inquiry: answer({
      inquiry: create({ from: g4, to: g }),
      status: "inquiry-answer-status-negative",
    }),
  });
  answer({
    inquiry: create({ from: g3, to: g }),
    status: "inquiry-answer-status-positive",
  });
  revise({
    inquiry: answer({
      inquiry: create({ from: g1, to: g }),
      status: "inquiry-answer-status-needs-interaction",
    }),
  });

  // more
  confirm({
    inquiry: answer({
      inquiry: create({ from: g2, to: g3 }),
      status: "inquiry-answer-status-needs-interaction",
    }),
  });
  confirm({
    inquiry: answer({
      inquiry: create({ from: g3, to: g4 }),
      status: "inquiry-answer-status-positive",
    }),
  });
}
