import { Browser } from "jsr:@astral/astral";
import { createOrConnectChrome } from "./lib/screenshot.ts";
import logstfRoute from "./routes/logstf/mod.ts";

// deno-lint-ignore prefer-const
let browser: Browser;
browser ??= await createOrConnectChrome();

const logsRoute = new URLPattern({ pathname: "/v1/logstf" });

Deno.serve(async (req) => {
  const logsMatch = logsRoute.test(req.url);

  if (req.method === "POST" && logsMatch) {
    return await logstfRoute(req);
  }

  return Response.json({ message: "ok" }, {});
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
