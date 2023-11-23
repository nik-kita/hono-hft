import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const api = new Hono()
  .post(
    "/credentials",
    zValidator(
      "json",
      z.object({
        key: z.string(),
        secret: z.string(),
        passphrase: z.string(),
      }),
    ),
    (c) => {
      return c.jsonT({
        ok: "google",
      });
    },
  )
  .get("/hello", (c) => {
    return c.jsonT("world");
  });
