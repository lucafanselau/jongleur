/**
 * @file ~clips/index.ts~ Transform descriptive keyframes into clips (eg. a clips store to work with)
 **/

export * from "./types";
export * from "./config";
export { createTimeline, timeline } from "./parse";
export * from "./fields";
export { Inherit } from "./utils";
