import { defineConfig } from "tsup";

const entries = {
  index: "src/index.ts",
  timeline: "src/timeline/index.ts"
  // progress: "src/progress/index.ts",
  // scroll: "src/scroll/index.ts"
};

export default defineConfig({
  entry: entries,
  dts: true,
  format: ["cjs", "esm"],
  clean: true
});
