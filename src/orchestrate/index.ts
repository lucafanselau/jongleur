/**
 * @file ~clips/index.ts~ Transform descriptive keyframes into clips (eg. a clips store to work with)
 **/

export * from "./types";
export * from "./config";
export { createOrchestrate } from "./parse";
export { createField, defaultFields, defaultDOMFields, defaultThreeFields, orchestrate } from "./fields";
export type { DefaultFields } from "./fields";
export { clips, InheritSymbol } from "./utils";
