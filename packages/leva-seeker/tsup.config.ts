import { defineConfig } from "tsup";

const entries = {
  index: "src/index.ts"
};

export default defineConfig({
  entry: entries,
  dts: { resolve: "jongleur" },

  format: ["cjs", "esm"],
  clean: true
});
