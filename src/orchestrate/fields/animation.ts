// Just some utilities for the animation fields

import type { AnimationAction, AnimationClip, AnimationMixer } from "three";
import { FieldStores } from "./store";
import { createField } from "./utils";

export type AnimationApi<T extends AnimationClip = AnimationClip> = {
  mixer: AnimationMixer;
  actions: {
    [key in T["name"]]: AnimationAction | null;
  };
};

export const animationFadeDuration = 0.5;

export const animationFields = {
  animation: createField(FieldStores.String, (target: AnimationApi, value, last) => {
    if (last) target.actions[last]?.fadeOut(animationFadeDuration);
    // and start the new animation
    target.actions[value]?.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(animationFadeDuration).play();
  }),
  time: createField(FieldStores.Number, (target: AnimationApi, value) => {
    target.mixer.setTime(value);
  })
};
