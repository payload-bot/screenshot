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
    headless: false,
    userAgent: "Screenshot Service | payload.tf 0.1.0",
  });

  return browser;
}

export async function generateClipBounds(page: Page, options: CaptureOptions) {
  return await page.evaluate((options) => {
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
  }, { args: [options] });
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
  options: CaptureOptions = { left: 0, top: 0 },
): Promise<Uint8Array> {
  const page = await createPage(url);

  let styles;
  if (options.cssPath) {
    styles = await Deno.readTextFile(options.cssPath!);
  }

  try {
    if (styles) {
      await page.evaluate(async (styles) => {
        const style = document.createElement("style");
        style.appendChild(document.createTextNode(styles));

        const promise = new Promise((resolve, reject) => {
          style.onload = resolve;
          style.onerror = reject;
        });

        document.head.appendChild(style);

        await promise;
      }, { args: [styles] });
    }

    if (options.waitFor) {
      if (Array.isArray(options.waitFor)) {
        await Promise.all(
          options.waitFor.map((selector) => page.waitForSelector(selector)),
        );
      } else {
        await page.waitForSelector(options.waitFor);
      }
    }

    const clip = await generateClipBounds(page, options);

    const screenshotBuffer = await page.screenshot({
      clip: { ...clip, scale: 1 },
      captureBeyondViewport: true,
      format: "webp",
    });

    return screenshotBuffer;
  } catch (e) {
    console.error(e);
    throw e;
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
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    page.close();
  }
}
