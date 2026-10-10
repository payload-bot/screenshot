import { capturePage } from "../lib/mod.ts";
import { URL } from "node:url";
import logsCss from "./logs.css";

const logsTfHost = "logs.tf";

export default async function logstfRoute(url: URL) {
  if (url.host !== logsTfHost) {
    return Response.json({
      message: "Invalid log url",
    }, {
      status: 400,
    });
  }

  const logIdString = url.pathname.slice(1).trim();
  const logId = Number(logIdString);

  if (isNaN(logId) && !isFinite(logId)) {
    return Response.json({
      message: "Invalid log url",
    }, {
      status: 400,
    });
  }

  const screenshotBuffer = await capturePage(url.href, {
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

    cssPath: logsCss,
  });

  return new Response(screenshotBuffer, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
}
