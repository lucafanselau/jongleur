/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

import dts from "vite-plugin-dts";

import * as pkg from "./package.json";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    dts({
      // rollupTypes: true,
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
      // plugins: [typescript({ tsconfig: path.resolve(__dirname, "tsconfig.build.json") })]
    }
  }
});
