import { createPlugin } from "leva/plugin";
import { timeline } from "jongleur";
import { SeekerComponent } from "./seeker";

import { normalize, sanitize } from "./seeker-plugin";

const [refs] = timeline({}, {}, {});

export const seeker = createPlugin({
  normalize,
  sanitize,
  format: (value: any, settings: any) => refs.toString(),
  component: SeekerComponent
});
