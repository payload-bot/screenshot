import { Hono } from "hono";
import { capturePage } from "../lib/mod.ts";
import logsCss from "./logs.css";
import { sValidator } from "@hono/standard-validator";
import { urlSchema } from "../lib/types.ts";

const logsTfHost = "logs.tf";

const app = new Hono();

app.get("/", sValidator('query', urlSchema), async (c) => {
  const url = c.req.valid('query').url;

  if (url.host !== logsTfHost) {
    c.json({ message: "Invalid log url" }, 400);
  }

  const logIdString = url.pathname.slice(1).trim();
  const logId = Number(logIdString);

  if (isNaN(logId) && !isFinite(logId)) {
    c.json({ message: "Invalid log url" }, 400);
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
      "Cache-Tag": `previews,host:logstf`,
      "Cache-Control": "public, max-age=31536000",
    }
  });
});

export default app;
