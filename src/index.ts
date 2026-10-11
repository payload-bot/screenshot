import logstfRoutes from "./logstf/mod";
import etf2lRoutes from "./etf2l/mod";
import { Hono } from "hono";

export const app = new Hono<{ Bindings: CloudflareBindings }>();

app.basePath("/v1");

app.route("logstf", logstfRoutes)
app.route("etf2l", etf2lRoutes)

export default app;

