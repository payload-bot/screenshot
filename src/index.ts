import logstfRoutes from "./logstf/mod";
import etf2lRoutes from "./etf2l/mod";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

export const app = new Hono<{ Bindings: CloudflareBindings }>().basePath("/v1");

if (process.env.NODE_ENV === "production") {
  const username = process.env.BASIC_AUTH_USERNAME!;
  const password = process.env.BASIC_AUTH_PASSWORD!;

  app.use(basicAuth({ username, password }));
}

app.route("/logstf", logstfRoutes);
app.route("/etf2l", etf2lRoutes);

export default app;
