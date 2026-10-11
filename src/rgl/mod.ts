import { sValidator } from "@hono/standard-validator";
import { capturePage } from "../lib/mod.js";
import { urlSchema } from "../lib/types.js";
import { Hono } from "hono";

const rglHost = "rgl.gg";
const matchRegex = /rgl\.gg\/Public\/Team(\.aspx)*\?t=\d+\&r=\d+/;

const app = new Hono();

app.get("/matches", sValidator('query', urlSchema), async (c) => {
  const url = c.req.valid('query').url;

  if (url.host !== rglHost) {
    return c.json({ message: "Invalid rgl url" }, 400);
  }

  const isRglUrl = matchRegex.test(url.href);

  if (!isRglUrl) {
    return c.json({ message: "Invalid rgl url" }, 400);
  }

  const screenshotBuffer = await capturePage(
    url.href,
    {
      top: {
        selector: "#ContentPlaceHolder1_pnlMain",
        edge: "top",
      },
      left: {
        selector:
          "#ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_divTeamInfo > div.col-md-12.col-lg-12.text-center > div:nth-child(2) > div.col-lg-4.col-sm-12",
        edge: "left",
      },
      right: {
        selector:
          "#ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_divTeamInfo > div.col-md-12.col-lg-12.text-center > div:nth-child(2) > div.col-lg-4.col-sm-12",
        edge: "right",
      },
      bottom: {
        selector:
          "#ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_divTeamInfo > div.col-md-12.col-lg-12.text-center > div:nth-child(2) > div.col-lg-4.col-sm-12",
        edge: "bottom",
      },
    },
  );

  return new Response(screenshotBuffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Tag": `previews,host:rgl`,
      "Cache-Control": "public, max-age=31536000",
    },
  });
});

export default app;
