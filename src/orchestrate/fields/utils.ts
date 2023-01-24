import type { FieldDefinition, FieldStore } from "../types";

export const createField = <Target, Store>(
  store: FieldStore<Store>,
  assign: (target: Target, value: Store, last: Store) => void
): FieldDefinition<Target, Store> => ({
  store,
  assign,
  apply: () => {}
});
