import { capturePage } from "../../lib/mod.ts";

const rglHost = "rgl.gg";
const matchRegex = /rgl\.gg\/Public\/Team(\.aspx)*\?t=\d+\&r=\d+/;

export default async function rglTeamRoute(url: URL) {
  if (url.host !== rglHost) {
    return Response.json({
      message: "Invalid rgl url",
    }, {
      status: 400,
    });
  }

  const isRglUrl = matchRegex.test(url.href);

  if (!isRglUrl) {
    return Response.json({
      message: "Invalid rgl url",
    }, {
      status: 400,
    });
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
    },
  });
}
