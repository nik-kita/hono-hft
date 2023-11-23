import { Hono } from "hono";

export const api = new Hono()
  .post("/credentials", (c) => {
    return c.jsonT({
      ok: "google",
    });
  })
  .get("/hello", (c) => {
    return c.jsonT("world");
  });
