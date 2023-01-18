import { Object3D, Vector3 } from "three";
import { lerp } from "../../utils";
import { FieldDefinition, FieldStore } from "../types";

const vector3 = new Vector3();
const Vector3Store: FieldStore<Vector3> = {
  eq: (a, b) => a.equals(b),
  interp: (a, b, alpha) => {
    vector3.lerpVectors(a, b, alpha);
    return vector3;
  },
  set: (object, value) => {
    object.store.copy(value);
  }
};

const eqq = (a: any, b: any) => a === b;

const NumberStore: FieldStore<number> = {
  eq: eqq,
  interp: lerp,
  set: (o, v) => void (o.store = v)
};

const StringStore: FieldStore<string> = {
  eq: eqq,
  interp: (a, b, alpha) => (alpha >= 0.5 ? b : a),
  set: (o, v) => void (o.store = v)
};

const animationType: FieldDefinition<Object3D, "abc" | "def"> = {
  store: StringStore
};
