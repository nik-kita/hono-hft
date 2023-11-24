import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { apply_private_connect_token } from "../../kucoin/req.ts";

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
    async (c) => {
      const res = await apply_private_connect_token(c.req.valid("json"));

      return c.jsonT(res);
    },
  )
  .get("/hello", (c) => {
    return c.jsonT("world");
  });
