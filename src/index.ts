import etf2lMatchesRoute from "./etf2l-matches/mod";
import etf2lTeamRoute from "./etf2l-teams/mod";
import { urlBody } from "./lib/types";
import { type } from "arktype";
import logstfRoute from "./logstf/mod";
import rglTeamRoute from "./rgl/mod";

const logsRoutePattern = new URLPattern({ pathname: "/v0/logstf" });
const etf2lTeamRoutePattern = new URLPattern({ pathname: "/v0/etf2l/teams" });
const etf2lMatchRoutePattern = new URLPattern({
  pathname: "/v0/etf2l/matches",
});
const rglTeamRoutePattern = new URLPattern({ pathname: "/v0/rgl/teams" });

export default {
  async fetch(req, env) {
    if (req.method !== "POST") {
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

    if (logsRoutePattern.test(req.url)) {
      return await logstfRoute(out.url);
    }

    if (etf2lTeamRoutePattern.test(req.url)) {
      return await etf2lTeamRoute(out.url);
    }

    if (etf2lMatchRoutePattern.test(req.url)) {
      return await etf2lMatchesRoute(out.url);
    }

    if (rglTeamRoutePattern.test(req.url)) {
      return await rglTeamRoute(out.url);
    }

    return Response.json({ message: "ok" }, {});
  }
}
