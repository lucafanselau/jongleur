import { Color, Euler, Quaternion, Vector3 } from "three";
import { lerp } from "../../utils";
import { FieldStore } from "../types";

const eqq = (a: any, b: any) => a === b;

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

const quaternion = new Quaternion();
const QuaternionStore: FieldStore<Quaternion> = {
  eq: (a, b) => a.equals(b),
  interp: (a, b, alpha) => {
    quaternion.slerpQuaternions(a, b, alpha);
    return quaternion;
  },
  set: (object, value) => {
    object.store.copy(value);
  }
};

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

const BooleanStore: FieldStore<boolean> = {
  eq: eqq,
  interp: (a, b, alpha) => (alpha >= 0.5 ? b : a),
  set: (o, v) => void (o.store = v)
};

const color = new Color();
const ColorStore: FieldStore<Color> = {
  eq: (a, b) => a.equals(b),
  interp: (a, b, alpha) => {
    color.lerpColors(a, b, alpha);
    return color;
  },
  set: (object, value) => {
    object.store.copy(value);
  }
};

export const FieldStores = {
  Vector3: Vector3Store,
  Number: NumberStore,
  String: StringStore,
  Color: ColorStore,
  Quaternion: QuaternionStore,
  Boolean: BooleanStore
};
