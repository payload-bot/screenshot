import { Browser } from "jsr:@astral/astral";
import { capturePage, createOrConnectChrome } from "./screenshot.ts";

let browser: Browser;
browser ??= await createOrConnectChrome();

Deno.serve(async (req) => {
  const maches = "https://logs.tf/3691898";

  const screenshotBuffer = await capturePage(maches, {
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

    cssPath: await Deno.realPath("./logs.css"),
  });

  return new Response(screenshotBuffer, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
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
