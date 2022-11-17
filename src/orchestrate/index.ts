/**
 * @file ~clips/index.ts~ Transform descriptive keyframes into clips (eg. a clips store to work with)
 **/

export * from "./types";
export * from "./config";
export { createOrchestrate, orchestrate } from "./parse";
export * from "./fields";
export { helpers, InheritSymbol } from "./utils";
