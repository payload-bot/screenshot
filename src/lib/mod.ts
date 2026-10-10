import { createPage, generateClipBounds } from "./screenshot.ts";
import { CaptureOptions } from "./screenshotTypes.ts";

export async function capturePage(
  url: string,
  options: CaptureOptions = { left: 0, top: 0 },
): Promise<Uint8Array> {
  console.info(`creating page for ${url}`);

  const page = await createPage(url);

  try {
    if (options.cssPath) {
      console.debug("inserting styles");

      await page.addStyleTag({
        content: options.cssPath
      });
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
      type: "jpeg"
    });

    console.debug("done");
    return screenshotBuffer;
  } catch (e) {
    await page.close();
    console.error(e);
    throw e;
  }
}

export async function captureSelector(url: string, selector: string) {
  const page = await createPage(url);

  try {
    await page.goto(url);

    const element = await page.waitForSelector(selector);

    const screenshot = await element!.screenshot({ type: "jpeg" });

    console.info("done");
    return screenshot;
  } catch (e) {
    await page.close();
    console.error(e);
    throw e;
  }
}
