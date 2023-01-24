import { Light, Object3D } from "three";
import { FieldsBase } from "../types";
import { FieldStores } from "./store";
import { createField } from "./utils";

export const defaults = {
  three: {
    // Object3D Fields
    position: createField(FieldStores.Vector3, (t: Object3D, value) => t.position.copy(value)),
    scale: createField(FieldStores.Vector3, (t: Object3D, value) => t.scale.copy(value)),
    rotation: createField(FieldStores.Quaternion, (t: Object3D, value) => t.rotation.setFromQuaternion(value)),
    lookAt: createField(FieldStores.Vector3, (t: Object3D, value) => t.lookAt(value)),
    visible: createField(FieldStores.Boolean, (t: Object3D, value) => (t.visible = value)),

    // Light Fields
    intensity: createField(FieldStores.Number, (t: Light, value) => (t.intensity = value))
  },
  dom: {
    opacity: createField(FieldStores.Number, (target: HTMLElement, value) => (target.style.opacity = value.toString())),
    // https://developer.mozilla.org/en-US/docs/Web/CSS/translate
    translate: createField(
      FieldStores.LengthOrPercentage2,
      (target: HTMLElement, value) => (target.style.transform = `translate(${value[0]}, ${value[1]}, 0)`)
    ),
    translate3d: createField(
      FieldStores.LengthOrPercentage3,
      (target: HTMLElement, value) => (target.style.transform = `translate(${value[0]}, ${value[1]}, ${value[2]})`)
    )
  },
  animation: {}
} satisfies Record<string, FieldsBase>;

export const defaultFields = {
  ...defaults.three,
  ...defaults.dom
};

export type DefaultFields = typeof defaultFields;
