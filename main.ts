import logstfRoute from "./routes/logstf/mod.ts";
import { urlBody } from "./lib/types.ts";
import { type } from "arktype";
import etf2lMatchesRoute from "./routes/etf2l-matches/mod.ts";
import rglTeamRoute from "./routes/rgl/mod.ts";
import etf2lTeamRoute from "./routes/etf2l/mod.ts";

const logsRoutePattern = new URLPattern({ pathname: "/v0/logstf" });
const etf2lTeamRoutePattern = new URLPattern({ pathname: "/v0/etf2l/teams" });
const etf2lMatchRoutePattern = new URLPattern({
  pathname: "/v0/etf2l/matches",
});
const rglTeamRoutePattern = new URLPattern({ pathname: "/v0/rgl/teams" });

Deno.serve(async (req) => {
  if (req.method === "GET") {
    return Response.json({ message: "ok" }, {});
  }

  const out = urlBody(await req.json());

  if (out instanceof type.errors) {
    return Response.json({
      message: out.summary,
    }, {
      status: 400,
    });
  }

  if (req.method === "POST" && logsRoutePattern.test(req.url)) {
    return await logstfRoute(out.url);
  }

  if (req.method === "POST" && etf2lTeamRoutePattern.test(req.url)) {
    return await etf2lTeamRoute(out.url);
  }

  if (req.method === "POST" && etf2lMatchRoutePattern.test(req.url)) {
    return await etf2lMatchesRoute(out.url);
  }

  if (req.method === "POST" && rglTeamRoutePattern.test(req.url)) {
    return await rglTeamRoute(out.url);
  }

  return Response.json({ message: "ok" }, {});
});
