<div align="center">
    <img src='https://jongleur.guythat.codes/logo.png' border='0' alt='juggling'/>
</div>
<h1 align="center"> Jongleur </h1>

<p align="center">
German /Jon·g·leur/ ~ Juggler
</p>

![](./assets/demo.gif)

## Description

- Simple and reusable primitives for react-three-fiber animation and orchestration.
- Lightweight and easy to use.

Use cases (currently) include:

- Arbitrary timeline for animation of three.js objects
- Link timelines to scroll

⚠ ️This README will cover the basic usage of the library and how to get started quickly. If you want in depth explanations check out the [documentation site](https://jongleur.guythat.codes)

Using Jongleur, you can easily write engaging and interesting landingpages, that stand out, while also supporting a wide variety of devices and browsers as it is based on the fantastic [three.js](https://threejs.org/) and [react-three-fiber](https://github.com/pmndrs/react-three-fiber).

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

Next we will cover how to use the library.

## Timeline

A timeline is a comprised of multiple objects that are animated using a keyframe syntax. Just described how you want the object to be during specific keyframes and the timeline will interpolate the values between them.

The timeline function returns refs, a seek object and the internal api.

```ts
import { timeline } from "jongleur";

const [refs, seek, api] = timeline({ first: { position: [0, 0, 0] } }, { first: { 1: { position: [0, 1, 0] } } });
```

This timeline would animate an object called `first` from position `[0, 0, 0]` to `[0, 1, 0]` over the course of the timeline.

Here are some of the main benefits of using the `timeline` function:

- 🔒 **Fully type safe**: Advanced typescript features ensure that all animations are valid
- 🏎 **Performance optimized**: Demand-based frameloop is fully supported. Since Jongleur knows your whole animation, only render a new frame if it is really needed.
- 📒 **Single source of truth**: Simple maintenance of large scenes
- ➡️ **Progress abstraction**: Animations can be driven by scroll, time or other forms of input
- 🖱 **Scroll Utilities**: Create stunning scroll-based interactive sites with a toolbox of React components

## Refs

The refs returned by the timeline function can be used like regular react ref objects. This makes the animation extremely easy to use and also check if the object satisfies the fields used during the animation.

```tsx
// This is inside of an react-three-fiber Canvas
const Scene = () => {
  return (
    <mesh ref={refs.first}>
      <boxBufferGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};
```

## Seek

Seek is an object, which tracks the current progression. It can be used to seek to a specific point in time or to link the timeline to scroll or other sources of progress.

```tsx
const ProgressButton = () => {
  const [progress, setProgress] = useState(0);

  return <button onClick={() => (seek.current += 0.05)} />;
};
```

`seek.current` can be updated from anywhere, even outside of the react-three-fiber reconciler.

## Scroll

One option to use the timeline is to link it to scroll. This can be done using the `Scroll` Components exposed by `Jongleur`.

```tsx
import { Suspense } from "react";
import { Scroll } from "jongleur";

const ScrollWrapper = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Scroll.Controls seeker={seek} pages={3}>
        <Scene />
      </Scroll.Controls>
    </Suspense>
  );
};
```

Along side `Scroll.Controls` also exposes a bunch of useful utilities, like a Scroll Snap (`Scroll.Snaps`) feature or an equivilant to drei's `Html` utility (`Scroll.Html`) together with positioning utilites (`Scroll.At`). Check out the [documentation site](https://jongleur.guythat.codes) for more information.

## Further steps

If you want to learn more about the API, I highly encourage you to checkout the [documentation site](https://jongleur.guythat.codes). If you want to dig into some code, I have also compiled a brief list of examples on CodeSandbox:

- README example: [here](https://codesandbox.io/s/jongleur-minimal-demo-fk4e2z)
- Scroll snaps and markers: [here](https://codesandbox.io/s/jongleur-scroll-snap-6b8qpq)

And more are coming soon...

## Contributing

If you are experienced with react-three-fiber and want to contribute, you are very welcome to do so. If have created some issues labled "enhancement". To get started with the repository locally, you'll first have to clone the repo and then run the following commands:

```sh
pnpm install # we are using so pnpm's workspace feature, so make sure you have pnpm installed
pnpm start:demo
```

After that you will have a live demo running. This application can be found under `apps/demo`. It is configured to compile the HMR the source code of the library, so that you see the changes that you make in real-time. Before opening an pr, please make sure that `pnpm check` still finishes with a 0 exit code.
