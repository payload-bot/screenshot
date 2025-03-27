import { captureSelector } from "../../lib/mod.ts";

const etf2lHost = "etf2l.org";
const teamsPrefix = "/teams/";

export default async function etf2lTeamRoute(url: URL) {
  if (url.host !== etf2lHost) {
    return Response.json({
      message: "Invalid etf2l url",
    }, {
      status: 400,
    });
  }

  const teamIdString = url.pathname.slice(teamsPrefix.length).trim();
  const teamId = Number(teamIdString);

  if (isNaN(teamId) && !isFinite(teamId)) {
    return Response.json({
      message: "Invalid etf2l url",
    }, {
      status: 400,
    });
  }

  const screenshotBuffer = await captureSelector(
    url.href,
    "#content > div > div > table.pls",
  );

  return new Response(screenshotBuffer, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
}
