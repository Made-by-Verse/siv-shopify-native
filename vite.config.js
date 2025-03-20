import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";

export default defineConfig({
  plugins: [shopify()],
  assetsInclude: ["**/*.svg", "**/*.woff2"],
  build: {
    emptyOutDir: true,
  },
});
