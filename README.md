<div align="center">
    <img src='https://jongleur.guythat.codes/logo.png' border='0' alt='juggling'/>
</div>
<h1 align="center"> Jongleur </h1>

<p align="center">
German /Jon·g·leur/ ~ Juggler
</p>

![](./assets/demo.gif)

## Description

Jongleur is a library that serves two purposes. First it introduces a keyframe-based (think of a timeline editor in blender or video editors) notation to write animations for objects (three.js objects or vanilla DOM object). Secondly, its provides a toolbox of utilities to bring the animations to life, either as a Scroll Animation or using different forms of progress.

Using Jongleur, you can easily write engaging and interesting landingpages, that stand out, while also supporting a wide variety of devices and browsers as it is based on the fantastic [three.js](https://threejs.org/) and [react-three-fiber](https://github.com/pmndrs/react-three-fiber).

Here are some of the main benefits of using _jongleur_:

- 🔒 **Fully type safe**: Advanced typescript features ensure that animations are valid
- 🏎 **Performance optimized**: Demand-based frameloop is fully supported
- 📒 **Single source of truth**: Simple maintenance of large scenes
- ➡️ **Progress abstraction**: Animations can be driven by scroll, time or other forms of input
- 🖱 **Scroll Utilities**: Create stunning scroll-based interactive sites with a toolbox of React components

⚠ ️This README will cover the basic usage of the library and how to get started quickly. If you want in depth explanations check out the [documentation site](https://jongleur.guythat.codes)

## Getting Started

```sh
npm install jongleur # or pnpm add or yarn add
```

It is best to add jongleur to your already existing react-three-fiber and three.js scene. If you are starting from scratch make sure to install the peer dependencies as well:

```sh
npm install react react-dom @react-three/fiber three
```

If you are using **typescript** (which is highly recommended), also install that:

```sh
npm install --save-dev typescript @types/three
```

Next we will cover how to use the library. You can also checkout a live demo [here]()

## First create the animations

First define how you want the scene to behave. This is the part that is inspired by keyframe editors. The first parameter is the base scene (eg. how do you want the scene to look at the beginning). The second parameter is basically a listing, for every object, at which stage you want to object to have which properties. _Jongleur_ is unopinionated in that you can freely decide on the scale of keyframes. The third argument is for configuring the scene.

The resulting store, per convention called `clips`, contains every information necessary to make the scene run. _Jongleur_ figures out the best way to transition between those states.

```tsx
import { orchestrate, helpers } from "jongleur";

const clips = orchestrate(
  {
    box: { position: new Vector3(0, 0, 0), visible: false }, // a normal three.js Object3D
    camera: { position: new Vector3(0, 2, 0), lookAt: new Vector3(0, 0, 0) }, // a camera object (uses the lookAt field)
    div: { opacity: 0 } // HTML elements can be animated aswell
  },
  {
    box: { 0.5: { visible: helpers.state(true) }, 1: { position: helpers.state(new Vector3(0, 1, 0)) } }, // box gets visible halfway through, and moves up as well
    camera: { 1: { lookAt: helpers.state(new Vector3(0, 1, 0)) } }, // camera rotates up during the animation,
    div: { 0.8: { opacity: helpers.inherit }, 1: { opacity: helpers.state(1) } } // div stays invisible for 80% of the animation, then transitions to full opacity
  },
  { damping: true, interpolation: "ease-in-out" }
);
```

If you want to have more information on what can be passed to the `orchestrate` function, look [here](https://jongleur.guythat.codes/getting-started/keyframes).

## Registering objects to you scene

Connecting your scene to the animation is simple. Just use the `ref` field where possible, via the `useRegister` hook, or use helper hooks for elements that are not declared in jsx. You can use the same hook for vanilla react elements as well.

```tsx
import { useRegister } from "jongleur";

// This is a scene expected to live in your r3f Canvas
const Scene = () => {
  const register = useRegister(clips);
  useThreeCamera(clips, "camera"); // camera is an object that is created by r3f
  return (
    <group>
      {/* This will be the box to be animated */}
      <mesh ref={register("box")}>
        <meshStandardMaterial color="#5B21B6" />
        <boxGeometry />
      </mesh>
    </group>
  );
};
```

## Choosing a form of progress

The last step is to decide which source of progress should drive the animation. The most popular is `Scroll`, which works similar to drei's ScrollControls. `Scroll.Controls` is the component that makes your scene run. Along side `Scroll` also exposes a bunch of useful utilities, like a Scroll Snap feature or an equivilant to drei's `Html` utility together with positioning utilites.

```tsx
import { Scroll } from "jongleur";

const ScrollScene = () => {
  const register = useRegister(clips);

  return (
    <Scroll.Controls clips={clips}>
      <Scene />
      {/* This will lock the browser to the start and the end via the CSS scroll-snap API */}
      <Scroll.Snaps points={[0.5, 1.5]} />
      <Scroll.Html fixed>
        <Scroll.At at={0.2} align={"center"}>
          <div ref={register("div")}>This text will be fixed and animated</div>
        </Scroll.At>
      </Scroll.Html>
    </Scroll.Controls>
  );
};
```

You can also play with the live demo of this small example [here](https://codesandbox.io/s/jongleur-minimal-demo-fk4e2z).

## Further steps

If you want to learn more about the API, I highly encourage you to checkout the [documentation site](https://jongleur.guythat.codes). If you want to dig into some code, I have also compiled a brief list of examples on CodeSandbox:

- README example: [here](https://codesandbox.io/s/jongleur-minimal-demo-fk4e2z)
- Scroll snaps and markers: [here](https://codesandbox.io/s/jongleur-scroll-snap-6b8qpq)

And more are coming soon...

## Contributing

If you are experienced with react-three-fiber and want to contribute, you are very welcome to do so. If have created some issues labled "enhancement".
