import { createPage, generateClipBounds } from "./screenshot.ts";
import { CaptureOptions } from "./screenshotTypes.ts";

export async function capturePage(
  url: string,
  options: CaptureOptions = { left: 0, top: 0 },
): Promise<Uint8Array> {
  console.info(`creating page for ${url}`);

  await using page = await createPage(url);

  let styles;
  if (options.cssPath) {
    styles = await Deno.readTextFile(options.cssPath);
  }

  try {
    if (styles) {
      console.debug("inserting styles");

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
      console.debug("waiting for selectors");
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

    console.debug("done");
    return screenshotBuffer;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function captureSelector(url: string, selector: string) {
  await using page = await createPage(url);

  try {
    await page.goto(url);

    const element = await page.waitForSelector(selector);

    const screenshot = await element.screenshot({ format: "webp" });

    console.info("done");
    return screenshot;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
