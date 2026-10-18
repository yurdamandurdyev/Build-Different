import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const asset = (url) => path.join(dist, url.replace(/^\//, ""));
let html = await readFile(path.join(dist, "index.html"), "utf8");
for (const match of [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]) {
  const href = match[0].match(/href="([^"]+)"/)[1];
  let css = await readFile(asset(href), "utf8");
  for (const url of [...css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)]) {
    const data = await readFile(asset(url[1]));
    const mime = url[1].endsWith(".ttf") ? "font/ttf" : "image/svg+xml";
    css = css.replaceAll(
      url[0],
      `url("data:${mime};base64,${data.toString("base64")}")`,
    );
  }
  html = html.replace(
    match[0],
    () => `<style>${css.replace(/<\/style/gi, "<\\/style")}</style>`,
  );
}
for (const match of [
  ...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g),
]) {
  const js = await readFile(asset(match[1]), "utf8");
  html = html.replace(
    match[0],
    () =>
      `<script type="module">${js.replace(/<\/script/gi, "<\\/script")}</script>`,
  );
}
const license = (
  await readFile(path.join(root, "public/fonts/OFL-Anton.txt"), "utf8")
).replaceAll("--", "—");
html = html.replace(
  "<head>",
  () => `<head><!-- Anton / SIL OFL\n${license}\n-->`,
);
await writeFile(path.join(root, "Sainttraining.html"), html);
console.log(
  "Exported standalone Sainttraining.html from the Astro production build.",
);
