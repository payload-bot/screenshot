// Import Astral
import { Browser, launch, Page } from "jsr:@astral/astral";

type ElementBasedBound = {
  selector: string;
  edge: "top" | "bottom" | "left" | "right";
};

interface CaptureOptions {
  [index: string]:
    | string
    | number
    | Array<string>
    | ElementBasedBound
    | undefined;

  waitFor?: string | Array<string>;
  top: number | ElementBasedBound;
  bottom?: number | ElementBasedBound;
  left: number | ElementBasedBound;
  right?: number | ElementBasedBound;
  cssPath?: string;
}

let browser: Browser | null = null;

async function createBrowser() {
  browser ??= await launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  return browser;
}

export async function generateClipBounds(page: Page) {
  return await page.evaluate((options) => {
    const bounds = {
      x: 0,
      y: 0,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };

    (["top", "left", "bottom", "right"] as const).forEach((edge) => {
      // deno-lint-ignore no-explicit-any
      const currentOption = (options as any)[edge];
      if (!currentOption) return;

      if (typeof currentOption == "number") {
        if (edge == "top") bounds.y = currentOption;
        if (edge == "left") bounds.x = currentOption;
        if (edge == "bottom") bounds.height = currentOption - bounds.y;
        if (edge == "right") bounds.width = currentOption - bounds.x;
      } else if (typeof currentOption == "object") {
        if (!document.querySelector(currentOption.selector)) {
          throw new Error("Top element not found.");
        }

        const element = document.querySelector(currentOption.selector);
        const boundingClientRect = element.getBoundingClientRect();

        if (edge === "top") bounds.y = boundingClientRect[currentOption.edge];
        if (edge === "left") bounds.x = boundingClientRect[currentOption.edge];
        if (edge === "bottom")
          bounds.height = boundingClientRect[currentOption.edge] - bounds.y;
        if (edge === "right")
          bounds.width = boundingClientRect[currentOption.edge] - bounds.x;
      }
    });

    return bounds;
  });
}

export async function createOrConnectChrome() {
  return await createBrowser();
}

async function createPage(url: string) {
  const page = await browser!.newPage();
  await page.goto(url);

  return page;
}

export async function capturePage(
  url: string,
  options: CaptureOptions = { left: 0, top: 0 }
): Promise<Uint8Array> {
  const page = await createPage(url);

  try {
    if (options.waitFor) {
      if (Array.isArray(options.waitFor)) {
        await Promise.all(
          options.waitFor.map((selector) => page.waitForSelector(selector))
        );
      } else {
        await page.waitForSelector(options.waitFor);
      }
    }

    const clip = await generateClipBounds(page);

    const screenshotBuffer = await page.screenshot({
      clip: { ...clip, scale: 1 },
      format: "webp",
    });

    return screenshotBuffer;
  } finally {
    page.close();
  }
}

export async function captureSelector(url: string, selector: string) {
  const page = await createPage(url);

  try {
    await page.goto(url);

    const element = await page.waitForSelector(selector);

    const screenshot = await element.screenshot({ format: "webp" });

    return screenshot;
  } finally {
    page.close();
  }
}
