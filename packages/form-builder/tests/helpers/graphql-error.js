export default (name) => ({
  data: { [name]: null },
  errors: [
    {
      message: "Test Error",
      locations: [
        {
          line: 1,
          column: 1,
        },
      ],
      path: name,
    },
  ],
});
