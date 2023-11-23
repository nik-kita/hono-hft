import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import { cors } from "https://deno.land/x/hono@v3.4.1/middleware.ts";
// import { serveStatic } from "npm:@hono/node-server/serve-static";
import { serveStatic } from "https://deno.land/x/hono@v3.10.1/middleware.ts";

const app = new Hono();
const port = 3000;

app.use(
  "/*",
  cors({ origin: Deno.env.get("CORS_ORIGIN") || "http://localhost:" + port }),
);

app.get("/api/hello", (c) => c.text("world"));

// deno-lint-ignore no-explicit-any
app.get("/*", serveStatic({ root: "./ui/dist" }) as any);

Deno.serve({
  port,
}, app.fetch);
