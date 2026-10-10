import etf2lMatchesRoute from "./etf2l-matches/mod";
import etf2lTeamRoute from "./etf2l-teams/mod";
import { urlBody } from "./lib/types";
import { type } from "arktype";
import logstfRoute from "./logstf/mod";

const logsRoutePattern = new URLPattern({ pathname: "/v0/logstf" });
const etf2lTeamRoutePattern = new URLPattern({ pathname: "/v0/etf2l/teams" });
const etf2lMatchRoutePattern = new URLPattern({
  pathname: "/v0/etf2l/matches",
});

export default {
  async fetch(req: Request, env: Env) {
    const query = new URL(req.url);
    const out = urlBody({ url: query.searchParams.get("url") });

    if (out instanceof type.errors) {
      return Response.json({
        message: out.summary,
      }, {
        status: 400,
      });
    }

    let response = null;

    if (logsRoutePattern.test(req.url)) {
      response = await logstfRoute(out.url);
    }

    if (etf2lTeamRoutePattern.test(req.url)) {
      response = await etf2lTeamRoute(out.url);
    }

    if (etf2lMatchRoutePattern.test(req.url)) {
      response = await etf2lMatchesRoute(out.url);
    }

    // add a 1y cache
    if (response != null) {
      response.headers.append("Cache-Tag", `previews,host:${new URL(out.url).host}`);
      response.headers.append("Cache-Control", "public, max-age=31536000");
      return response;
    }

    return Response.json({ message: "ok" }, {});
  }
}
