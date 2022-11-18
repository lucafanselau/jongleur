const base = "../..";
/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  tsconfig: base + "/tsconfig.json",
  out: "./src/pages/api",
  entryPoints: [
    base + "/src/store.ts",
    base + "/src/scroll/index.ts",
    base + "/src/utils.ts",
    base + "/src/orchestrate/index.ts",
    base + "/src/progress/index.ts",
  ],
};
