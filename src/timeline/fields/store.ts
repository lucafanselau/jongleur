import { Color, Euler, Quaternion, Vector3 } from "three";
import type { ColorRepresentation } from "three";
import { isNone, lerp } from "../../utils";
import type { FieldStore } from "../types";
import type { LengthOrPercentage } from "./utils";
import { lerpLengthOrPercentage } from "./utils";

const eqq = (a: any, b: any) => a === b;

const vector3 = new Vector3();
const Vector3Store: FieldStore<number | [number, number, number] | Vector3, Vector3> = {
  convert: e => {
    if (typeof e === "number") return new Vector3(e, e, e);
    else if (Array.isArray(e)) return new Vector3(e[0], e[1], e[2]);
    else return e;
  },
  eq: (a, b) => a.equals(b),
  interp: (a, b, alpha) => {
    vector3.lerpVectors(a, b, alpha);
    return vector3;
  },
  set: (object, value) => {
    if (isNone(object.store)) object.store = new Vector3();
    object.store.copy(value);
  }
};

const quaternion = new Quaternion();
const QuaternionStore: FieldStore<Quaternion | Euler | [x: number, y: number, z: number, order?: string], Quaternion> =
  {
    convert: e => {
      if (Array.isArray(e)) return new Quaternion().setFromEuler(new Euler(e[0], e[1], e[2], e[3]));
      else if (e instanceof Euler) return new Quaternion().setFromEuler(e);
      else return e;
    },
    eq: (a, b) => a.equals(b),
    interp: (a, b, alpha) => {
      quaternion.slerpQuaternions(a, b, alpha);
      return quaternion;
    },
    set: (object, value) => {
      if (isNone(object.store)) object.store = new Quaternion();
      object.store.copy(value);
    }
  };

const NumberStore: FieldStore<number, number> = {
  convert: e => e,
  eq: eqq,
  interp: lerp,
  set: (o, v) => void (o.store = v)
};

const StringStore: FieldStore<string, string> = {
  convert: e => e,
  eq: eqq,
  interp: (a, b, alpha) => (alpha >= 0.5 ? b : a),
  set: (o, v) => void (o.store = v)
};

const BooleanStore: FieldStore<boolean, boolean> = {
  convert: e => e,
  eq: eqq,
  interp: (a, b, alpha) => (alpha >= 0.5 ? b : a),
  set: (o, v) => void (o.store = v)
};

const color = new Color();
const ColorStore: FieldStore<ColorRepresentation | [number, number, number] | Color, Color> = {
  convert: e => {
    if (typeof e === "string" || typeof e === "number") return new Color(e);
    else if (Array.isArray(e)) return new Color(...e);
    else return e;
  },
  eq: (a, b) => a.equals(b),
  interp: (a, b, alpha) => {
    color.lerpColors(a, b, alpha);
    return color;
  },
  set: (object, value) => {
    if (isNone(object.store)) object.store = new Color();
    object.store.copy(value);
  }
};

type LOP2 = [LengthOrPercentage, LengthOrPercentage];
type LOP3 = [LengthOrPercentage, LengthOrPercentage, LengthOrPercentage];
const LOPStore: FieldStore<LengthOrPercentage[], LengthOrPercentage[]> = {
  convert: e => e,
  eq: (a, b) => a.every((a, index) => eqq(a, b[index])),
  interp: (a, b, alpha) => {
    if (a.length !== b.length) {
      const msg = `[jongleur] cannot lerp between length or percentage of difference dimensions: ${a.join()} and ${b.join()}`;
      throw new Error(msg);
    }
    return a.map((a, index) => lerpLengthOrPercentage(a, b[index], alpha));
  },
  set: (object, value) => void (object.store = value)
};

export const FieldStores = {
  Vector3: Vector3Store,
  Number: NumberStore,
  String: StringStore,
  Color: ColorStore,
  Quaternion: QuaternionStore,
  Boolean: BooleanStore,
  LengthOrPercentage2: LOPStore as unknown as FieldStore<LOP2, LOP2>,
  LengthOrPercentage3: LOPStore as unknown as FieldStore<LOP3, LOP3>
};
