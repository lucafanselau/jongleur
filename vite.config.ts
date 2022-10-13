import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import * as pkg from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: pkg.name,
      formats: ["es", "umd"],
      fileName: format => `${pkg.name}.${format}.js`
    },
    rollupOptions: {
      external: Object.keys(pkg.peerDependencies)
    }
  }
});
