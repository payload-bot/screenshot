import { type } from "arktype";
import { logsBody } from "./types.ts";
import { capturePage } from "../../lib/mod.ts";

const logsCssPath = await Deno.realPath("./logs.css");

const logsTfUrl = "https://logs.tf";

export default async function logstfRoute(req: Request) {
  const out = logsBody(await req.json());

  if (out instanceof type.errors) {
    return Response.json({
      message: out.summary,
    }, {
      status: 400,
    });
  }

  if (out.url.origin !== logsTfUrl) {
    return Response.json({
      message: "Invalid log url",
    }, {
      status: 400,
    });
  }

  const logIdString = out.url.pathname.slice(1).trim();
  const logId = Number(logIdString);

  if (isNaN(logId) && !isFinite(logId)) {
    return Response.json({
      message: "Invalid log url",
    }, {
      status: 400,
    });
  }

  const screenshotBuffer = await capturePage(out.url.href, {
    top: {
      selector: "#log-header",
      edge: "top",
    },
    left: {
      selector: "#log-header",
      edge: "left",
    },
    right: {
      selector: "#log-header",
      edge: "right",
    },
    bottom: {
      selector: "#log-section-players",
      edge: "bottom",
    },

    cssPath: logsCssPath,
  });

  return new Response(screenshotBuffer, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
}
