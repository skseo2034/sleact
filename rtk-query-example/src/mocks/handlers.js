import { rest } from "msw";

const counts = {
  egoing: 10,
  jane: 20,
  steve: 30
};
export const handlers = [
  /**
   * Example of a request handler—function that captures a request
   * and declares which mocked response to return upon match.
   * @see https://mswjs.io/docs/basics/request-handler
   */

  rest.get("https://example.com/api/count/:name", (req, res, ctx) => {
    return res(ctx.delay(2000), ctx.json(counts[req.params.name]));
  }),
  rest.post("https://example.com/api/count/:name", (req, res, ctx) => {
    console.log("req", req.body.value);
    counts[req.params.name] = req.body.value;
    return res(ctx.delay(2000), ctx.json(counts[req.params.name]));
  })
];
