import { type } from "arktype";
import { logsBody } from "./types.ts";
import { capturePage } from "../../lib/mod.ts";

const logsCssPath = await Deno.realPath("./logs.css");

export default async function logstfRoute(req: Request) {
  const out = logsBody(await req.json());

  if (out instanceof type.errors) {
    return Response.json({
      message: out.summary,
    }, {
      status: 400,
    });
  }

  if (out.url.origin !== "https://logs.tf") {
    return Response.json({
      message: "Invalid url",
    }, {
      status: 400,
    });
  }

  const screenshotBuffer = await capturePage(out.url.toString(), {
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
