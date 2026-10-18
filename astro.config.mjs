import { defineConfig } from "astro/config";
export default defineConfig({
  output: "static",
  server: { host: true },
  build: { inlineStylesheets: "never" },
  vite: { build: { modulePreload: false } },
  devToolbar: { enabled: false },
});
