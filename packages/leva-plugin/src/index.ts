import { createPlugin } from "leva/plugin";
import { SeekerComponent } from "./seeker";
import { timeline } from "jongleur";

const [refs] = timeline({}, {}, {});

import { normalize, sanitize } from "./seeker-plugin";

export const seeker = createPlugin({
  normalize,
  sanitize,
  format: (value: any, settings: any) => refs.toString(),
  component: SeekerComponent
});
