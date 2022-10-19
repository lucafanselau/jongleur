// exports of the main library
export { clips, InheritSymbol } from "./clip";
export { createOrchestrate, createField } from "./keyframes";
export { orchestrate, defaultFields } from "./fields";
export type { DefaultFields } from "./fields";
export * from "./hooks";

// exports of strategies (maybe we should package that seperately (like in a scroll.ts))
export { ScrollOverlay, Scrollable } from "./strategy/overlay";
