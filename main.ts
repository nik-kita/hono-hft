import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import { serveStatic } from "npm:@hono/node-server/serve-static";
// import { serveStatic } from "https://deno.land/x/hono@v3.10.1/middleware.ts";

const app = new Hono();

app.get("/*", serveStatic({ root: "./static" }));

Deno.serve({
  port: 3000,
}, app.fetch);
