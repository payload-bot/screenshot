import { env } from "cloudflare:workers";
import puppeteer, { Page } from "@cloudflare/puppeteer";
import { CaptureOptions } from "./screenshotTypes.ts";

export async function generateClipBounds(page: Page, options: CaptureOptions) {
  return await page.evaluate((args) => {
    const options = args.args;

    const bounds = {
      x: 0,
      y: 0,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };

    for (const edge of ["top", "left", "bottom", "right"]) {
      const currentOption = options[edge];
      if (!currentOption) return bounds;

      if (typeof currentOption == "number") {
        if (edge == "top") bounds.y = currentOption;
        if (edge == "left") bounds.x = currentOption;
        if (edge == "bottom") bounds.height = currentOption - bounds.y;
        if (edge == "right") bounds.width = currentOption - bounds.x;
      } else if (
        typeof currentOption == "object" && "selector" in currentOption
      ) {
        if (!document.querySelector(currentOption.selector)) {
          throw new Error("Top element not found.");
        }

        const element = document.querySelector(currentOption.selector);
        const boundingClientRect = element!.getBoundingClientRect();

        if (edge === "top") bounds.y = boundingClientRect[currentOption.edge];
        if (edge === "left") bounds.x = boundingClientRect[currentOption.edge];
        if (edge === "bottom") {
          bounds.height = boundingClientRect[currentOption.edge] - bounds.y;
        }
        if (edge === "right") {
          bounds.width = boundingClientRect[currentOption.edge] - bounds.x;
        }
      }
    }

    return bounds;
  }, { args: options });
}

export async function createPage(url: string) {
  const browser = await puppeteer.launch(env.BROWSER);
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.setUserAgent("Screenshot Service | payload.tf 1.0.0")
  await page.goto(url, { waitUntil: "networkidle2" });

  return page;
}

