import { Env, Hono, ToSchema } from "hono";
import { hc } from "hono/client";

type ApiType = Hono<
  Env,
  ToSchema<"post", "/api/credentials", {
    json: {
      key: string;
      secret: string;
      passphrase: string;
    };
  }, {
    connection_url: string;
  }>,
  "/"
>;

export const api_client = hc<ApiType>(import.meta.env.VITE_API_HOST);
