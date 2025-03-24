import { Browser } from "jsr:@astral/astral";
import { capturePage, createOrConnectChrome } from "./screenshot.ts";
import { logsBody } from "./types.ts";
import { type } from "arktype";

// deno-lint-ignore prefer-const
let browser: Browser;
browser ??= await createOrConnectChrome();

const logsRoute = new URLPattern({ pathname: "/v1/logstf" });
const logsCssPath = await Deno.realPath("./logs.css");

Deno.serve(async (req) => {
  const logsMatch = logsRoute.test(req.url);

  if (req.method === "POST" && logsMatch) {
    const out = logsBody(await req.json());

    if (out instanceof type.errors) {
      return new Response(
        JSON.stringify({
          message: out.summary,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }

    const screenshotBuffer = await capturePage(out.url, {
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

  return new Response("TEST", {});
});

Deno.addSignalListener("SIGINT", async () => {
  await removeBrowser();

  Deno.exit();
});

async function removeBrowser() {
  console.info("closing browser");

  if (!browser?.closed) {
    await browser.close();
  }
}
