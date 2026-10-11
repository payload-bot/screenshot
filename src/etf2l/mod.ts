import { Hono } from "hono";
import { capturePage, captureSelector } from "../lib/mod.js";
import { sValidator } from "@hono/standard-validator";
import { urlSchema } from "../lib/types.js";

const etf2lHost = "etf2l.org";
const matchesPrefix = "/matches/";
const teamsPrefix = "/teams/";

const app = new Hono();

app.get("/matches", sValidator('query', urlSchema), async (c) => {
  const url = c.req.valid('query').url;

  if (url.host !== etf2lHost) {
    return c.json({ message: "Invalid etf2l url" }, 400);
  }

  const matchIdString = url.pathname.slice(matchesPrefix.length).trim();
  const matchId = Number(matchIdString);

  if (isNaN(matchId) && !isFinite(matchId)) {
    return c.json({ message: "Invalid etf2l url" }, 400);
  }

  const screenshotBuffer = await capturePage(
    url.href,
    {
      top: {
        selector: "#content > div",
        edge: "top",
      },
      left: {
        selector: "#content",
        edge: "left",
      },
      right: {
        selector: "#content",
        edge: "right",
      },
      bottom: {
        selector: "#content > div > br",
        edge: "bottom",
      },
    },
  );

  return new Response(screenshotBuffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Tag": `previews,host:etf2l`,
      "Cache-Control": "public, max-age=31536000",
    },
  });
});

app.get("/teams", sValidator('query', urlSchema), async (c) => {
  const url = c.req.valid('query').url;

  if (url.host !== etf2lHost) {
    return c.json({ message: "Invalid etf2l url" }, 400);
  }

  const teamIdString = url.pathname.slice(teamsPrefix.length).trim();
  const teamId = Number(teamIdString);

  if (isNaN(teamId) && !isFinite(teamId)) {
    return c.json({ message: "Invalid etf2l url" }, 400);
  }

  const screenshotBuffer = await captureSelector(
    url.href,
    "#content > div > div > table.pls",
  );

  return new Response(screenshotBuffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Tag": `previews,host:etf2l`,
      "Cache-Control": "public, max-age=31536000",
    },
  });
});

export default app;
