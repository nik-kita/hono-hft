import { Hono } from "hono";
import { serveStatic } from "https://deno.land/x/hono@v3.10.1/middleware.ts";
import { api } from "./api.ts";

const port = 3000;
const app = new Hono()
  .route("/api", api)
  // TODO
  // deno-lint-ignore no-explicit-any
  .get("/*", serveStatic({ root: "./ui/dist" }) as any);

Deno.serve({
  port,
}, app.fetch);
