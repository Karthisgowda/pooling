const handler = require("./assistant");

test("assistant endpoint rejects non-post requests", async () => {
  const response = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await handler({ method: "GET" }, response);

  expect(response.setHeader).toHaveBeenCalledWith("Allow", "POST");
  expect(response.status).toHaveBeenCalledWith(405);
  expect(response.json).toHaveBeenCalledWith({ error: "Method not allowed" });
});
