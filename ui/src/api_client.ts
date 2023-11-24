import { hc } from "hono/client";
import { api } from "./api";

export const api_client = hc<typeof api>("/api");
