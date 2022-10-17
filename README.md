<div align="center">
    <img src='https://jongleur.vercel.app/juggling.png' border='0' alt='juggling'/>
</div>
<h1 align="center"> Jongleur </h1>

<p align="center">
German /Jon·g·leur/ ~ Juggler
</p>

## Description

Jongleur is a library that aims to make orchestrating complex 3d animations on websites easier to maintain and scale. Animations of different objects are expressed in an object notation, that is inspired by keyframes, such as commonly found in many animation softwares. This allows having a single source of truth for the movement of objects in the scene.

## Features

tbd

## Getting started

This library can be installed through your favorite package manager



## Concepts & Usage

At the core of every animation sequence is the orchestration function. This function enables you to have a single source of truth for the transitions that happen in the scene. _Jongleur_ heavily uses typescript features to enable writing these transitions easily while also enforcing a strict structure and preventing mistakes at development time. 


## Defining a scene and registering

To utilize this library one must understand how keyframes are parsed into transitions. For the sake of this implementation we will consider a simple scene with a single *object* which is the camera:

```typescript
import { orchestrate } from "jongleur";
import { Vector3 } from "three";

const [_, register] = orchestrate({
    camera: {
        position: new Vector3(0, 2, 0),
        lookAt: new Vector3(0, 0, 0)
    }
}, { ... })
```

We, therefore, define a simple scene with a camera, that gets initialized to be at position `[ 0, 2, 0 ]` and looks at the center of the scene `[ 0, 0, 0 ]`.

A small note on the usage of the orchestrate function. This library does its best so that the structure of the scene and their types are inferred. For example, through the definition above, we can infer that the camera has two animated _fields_ the `position` and the `lookAt` field. Furthermore, the register function can infer that the ref callback for the key `"camera"` is of type `React.RefCallback<Object3D>`. 

- to be done here


## Defining keyframes

After our scene is defined and connected to the three.js scene, we can start defining the keyframes, aka the second parameter to the orchestrate function. The keyframe definition expects a different timeline for every *object* in the scene. From now one we will only define the second parameter. 

```typescript

const [...] = orchestrate({ ... }, {

})

```

## Handling progress

## Applying state

> This is just a brainstorming section for now, outlining the different ideas. The outlined approach might differ from the actual algorithm implemented

- The underlying store keeps track of the last recorded progress. If no progress has been recorded, the last progress is `0`, which is implicitly the base state (aka the first parameter to the orchestrate function)
- Since the register function (aka the mounting and unmounting) can be called at any time, even when the animation is already in progress, the state at _last progress_ gets applied to the mounted element.
- When the progress is updated, the range between the _last progress_ and the _current progress_ gets compared to all clips, to check which clips might be in active transition. If multiple clips for a specific field are affected (this could be the case if the difference between the last and current progress is large) the last clip with regards to the time gets applied.

Hopefully, this pseudo definition is robust against most corner cases and weird register calls.

## Advanced Usage

### Custom Fields

A _Field_ represents a single property to be animated. Fields are defined through two functions, the `apply` and the `interpolate` function. A new field can be created with the exposed `createField` function, for example:

``` typescript
import { createField } from "jongleur";
import { Group } from "three";

const visibilityField = createField(
    // This is the apply function. It has two arguments, the target and the store
    // The target is the object that is later required by the register ref callback, this can be anything like a Group, Object3D or even a DOMElement. Ideally this would be the miminmal viable type to apply the store variable
    // The store is what is expected by the orchestrate function to define a specific state for that field. Most commonly this is would be a number or a vector of numbers
    (target: Group, store: boolean) => { 
        target.visible = store;
    },
    // This is the interpolate function, its job is to interpolate between two stores (a, b) at the current progress (alpha ∈ [0, 1]).
    // Note that typescript is able to infer all of the parameters types through the apply function
    (a, b, alpha, i) => {
        if (alpha > 0.5) return b;
        else return a;
    }
)
```
