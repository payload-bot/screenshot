import { capturePage } from "../lib/mod.js";

const etf2lHost = "etf2l.org";
const matchesPrefix = "/matches/";

export default async function etf2lMatchesRoute(url: URL) {
  if (url.host !== etf2lHost) {
    return Response.json({
      message: "Invalid etf2l url",
    }, {
      status: 400,
    });
  }

  const matchIdString = url.pathname.slice(matchesPrefix.length).trim();
  const matchId = Number(matchIdString);

  if (isNaN(matchId) && !isFinite(matchId)) {
    return Response.json({
      message: "Invalid etf2l url",
    }, {
      status: 400,
    });
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
    },
  });
}
