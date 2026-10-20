// Tiny static server for out/ with gzip, like a real host. Usage: node scripts/serve-out.mjs [port]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { gzipSync } from "node:zlib";
const out = new URL("../out/", import.meta.url).pathname;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json" };
createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  try {
    let body = await readFile(join(out, p));
    const type = types[extname(p)] ?? "application/octet-stream";
    const headers = { "content-type": type, "cache-control": p.includes("/_next/static/") ? "public, max-age=31536000, immutable" : "no-cache" };
    if (/html|javascript|css|svg|xml|json|text/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "")) { body = gzipSync(body); headers["content-encoding"] = "gzip"; }
    res.writeHead(200, headers).end(body);
  } catch { res.writeHead(404).end("Not found"); }
}).listen(Number(process.argv[2] ?? 4180), () => console.log("Serving out/ on", process.argv[2] ?? 4180));
