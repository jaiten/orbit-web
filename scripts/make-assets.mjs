// Renders the Open Graph / Twitter images and the Apple touch icon.
// Usage: npm run build && npm run assets   (needs the Chromium that Playwright already has installed)
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, copyFile } from "node:fs/promises";
import { extname, join } from "node:path";

const out = new URL("../out/", import.meta.url).pathname;
const app = new URL("../src/app/", import.meta.url).pathname;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json" };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(out, p));
    res.writeHead(200, { "content-type": types[extname(p)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
try {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, colorScheme: "light", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}/og/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  await page.locator("#og").screenshot({ path: join(app, "opengraph-image.png") });
  await copyFile(join(app, "opengraph-image.png"), join(app, "twitter-image.png"));

  const icon = await browser.newContext({ viewport: { width: 180, height: 180 } });
  const ip = await icon.newPage();
  await ip.setContent(`<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="180" height="180"><rect width="128" height="128" fill="#E87359"/><path d="M93 64a29 29 0 1 1-29-29" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="87" cy="41" r="8" fill="#fff"/></svg></body>`);
  await ip.screenshot({ path: join(app, "apple-icon.png") });
  console.log("Wrote opengraph-image.png, twitter-image.png, apple-icon.png");
} finally {
  await browser.close();
  server.close();
}
