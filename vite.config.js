import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import cleanup from "@by-association-only/vite-plugin-shopify-clean";

export default defineConfig({
  plugins: [shopify(), cleanup()],
  assetsInclude: ["**/*.svg", "**/*.woff2"],
  build: {
    emptyOutDir: false,
  },
});
