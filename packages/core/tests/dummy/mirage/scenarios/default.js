export default function (server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */
  server.create("communication-entity", { isApplicant: true });
  server.createList("communication-entity", 4);
  server.createList("communication-instance", 5);
}
