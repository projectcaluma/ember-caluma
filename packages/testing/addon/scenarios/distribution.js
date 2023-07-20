import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

export function createBlueprint(server) {
  const inquiryForm = server.create("form", {
    name: "Inquiry",
    slug: "inquiry",
    isPublished: false,
  });
  const inquiryAnswerForm = server.create("form", {
    name: "Inquiry answer",
    slug: "inquiry-answer",
    isPublished: false,
  });

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
  server.create("question", {
    slug: "inquiry-answer-hint",
    isRequired: "false",
    maxLength: 9999,
    minLength: 0,
    label: "Hint",
    type: "TEXTAREA",
    formIds: [inquiryAnswerForm.id],
  });

  server.create("workflow", { slug: "distribution" });
  server.create("workflow", { slug: "inquiry" });

  server.create("task", { slug: "distribution" });
  server.create("task", { slug: "create-inquiry" });
  server.create("task", { slug: "complete-distribution" });
  server.create("task", {
    slug: "inquiry",
    formId: inquiryForm.id,
    type: "COMPLETE_TASK_FORM",
  });
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
  server.create("task", { slug: "check-inquiries" });
}

export function createInquiry(
  server,
  distributionCase,
  { from, to, remark, deadline },
  workItemAttrs = {},
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

export function withdrawInquiry(server, { inquiry }) {
  inquiry.update({ status: "CANCELED" });

  return inquiry;
}

export function sendInquiry(server, { inquiry }) {
  const childCase = server.create("case", {
    status: "RUNNING",
    workflowId: "inquiry",
    document: server.create("document", {
      formId: "inquiry-answer",
      modifiedContentAt: faker.date.recent(),
    }),
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

export function answerInquiry(server, { inquiry, status, reason, hint }) {
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
    value: reason ?? faker.lorem.paragraphs(3, "\n\n"),
  });
  server.create("answer", {
    document: inquiry.childCase.document,
    questionId: "inquiry-answer-hint",
    value: hint ?? faker.lorem.paragraph(),
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

export function confirmInquiry(server, { inquiry }) {
  inquiry.update({ status: "COMPLETED", isRedoable: true });
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

  if (
    !inquiry.case.workItems.filter(
      (workItem) =>
        workItem.taskId === "check-inquiries" &&
        String(workItem.addressedGroups) === String(inquiry.addressedGroups),
    ).length
  ) {
    server.create("work-item", {
      taskId: "check-inquiries",
      status: "READY",
      case: inquiry.case,
      addressedGroups: inquiry.addressedGroups,
    });
  }

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
  const distributionWorkItem = server.create("work-item", {
    taskId: "distribution",
    status: "READY",
    case: server.create("case"),
  });

  const distributionCase = server.create("case", {
    id: "4222ab21-9c89-47de-98be-d62a8ed0ebeb",
    status: "RUNNING",
    workflowId: "distribution",
    parentWorkItem: distributionWorkItem,
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
  const withdraw = (...args) => withdrawInquiry(server, ...args);
  const send = (...args) => sendInquiry(server, ...args);
  const answer = (...args) => answerInquiry(server, ...args);
  const confirm = (...args) => confirmInquiry(server, ...args);
  const revise = (...args) => reviseInquiry(server, ...args);

  const distributionCase = createCase(server, { group: g });

  // controlling
  create({ from: g, to: g1 }, { id: "d570dfc3-0df7-4276-8735-892be011923c" });
  withdraw({
    inquiry: create(
      { from: g, to: g2 },
      { id: "4afed640-07a6-4eb9-82a7-b5e961391370" },
    ),
  });
  send({
    inquiry: create(
      {
        from: g,
        to: g2,
        deadline: faker.date.past(),
      },
      { id: "6bbdc36a-3174-4578-93d4-0cb84d3dab97", meta: {} },
    ),
  });
  confirm({
    inquiry: answer({
      inquiry: create(
        {
          from: g,
          to: g3,
          deadline: faker.date.past(),
        },
        { id: "88999388-daf2-4a18-b7e2-50373d082331" },
      ),
      status: "inquiry-answer-status-needs-interaction",
    }),
  });

  // "override" third controlling inquiry
  confirm({
    inquiry: answer({
      inquiry: create(
        { from: g, to: g3 },
        {
          id: "75d56729-5518-469d-ae66-188a5c32d59d",
          createdAt: faker.date.recent(),
        },
      ),
      status: "inquiry-answer-status-positive",
    }),
  });

  // withdrawn inquiry, should not be visible anywhere
  withdraw({
    inquiry: create(
      { from: g, to: g4 },
      { id: "7360fa66-83d2-4f6a-b489-5db46f6fd670" },
    ),
  });

  // addressed
  confirm({
    inquiry: answer({
      inquiry: create(
        { from: g2, to: g },
        { id: "e907584c-a38a-488e-80f7-bab6bb22f303" },
      ),
      status: "inquiry-answer-status-needs-interaction",
    }),
  });
  // "override" first addressed inquiry
  send({
    inquiry: create(
      {
        from: g2,
        to: g,
        deadline: DateTime.now().plus({ days: 2 }).toJSDate(),
      },
      {
        id: "4889435d-f310-472f-808b-7b20936c40fc",
        createdAt: faker.date.recent(),
      },
    ),
  });
  confirm({
    inquiry: answer({
      inquiry: create(
        { from: g4, to: g },
        { id: "4c5dbcc3-f42a-4c25-8d06-f85bd17edbf2" },
      ),
      status: "inquiry-answer-status-negative",
    }),
  });
  answer({
    inquiry: create(
      { from: g3, to: g },
      { id: "3f7eea45-251d-4934-81fd-27c78bbca88c" },
    ),
    status: "inquiry-answer-status-positive",
  });
  revise({
    inquiry: answer({
      inquiry: create(
        { from: g1, to: g },
        { id: "dd07b1a4-91e6-4411-a4ea-445637690577" },
      ),
      status: "inquiry-answer-status-needs-interaction",
    }),
  });

  // more
  confirm({
    inquiry: answer({
      inquiry: create(
        { from: g2, to: g3 },
        { id: "4f374860-28b3-465b-be5f-5e501a39fe8b" },
      ),
      status: "inquiry-answer-status-needs-interaction",
    }),
  });
  confirm({
    inquiry: answer({
      inquiry: create(
        { from: g3, to: g4 },
        { id: "16eebfae-55c5-4d31-ad48-7ed5578a22a2" },
      ),
      status: "inquiry-answer-status-positive",
    }),
  });

  return distributionCase;
}
