import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { apply_private_connect_token } from "../../kucoin/req.ts";
import { HTTPException } from "hono/http-exception";

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
  })
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json(err, 400);
    }

    return c.json(err, 500);
  });
