/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import * as pkg from "./package.json";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
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
