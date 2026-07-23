import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const pagesBase = process.env.PAGES_BASE ?? "/novel-esign-demos/";

export default defineConfig({
  root: fileURLToPath(new URL("./pages", import.meta.url)),
  base: pagesBase,
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  plugins: [react()],
  build: {
    outDir: `${projectRoot}out`,
    emptyOutDir: true,
  },
});
