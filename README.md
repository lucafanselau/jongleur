<div align="center">
    <img src='https://jongleur.vercel.app/juggling.png' border='0' alt='juggling'/>
</div>
<h1 align="center"> Jongleur </h1>

<p align="center">
German /Jon·g·leur/ ~ Juggler
</p>

## Description

Jongleur is a library that aims to make orchestrating complex 3d animations on websites easier to maintain and scale. Animations of different objects are expressed in an object notation, that is insprired by keyframes, such as commonly found in many animation softwares. This allows to have a single source of truth for the movement of objects in the scene.

## Getting started

This library can be installed through your favorite package manager

...tbd


## Concepts & Usage

At the core of every animation sequence is the orchestration function. This function enables you to have a single source of truth for the transitions that happen in the scene. _Jongleur_ heavily uses typescript features to enable writing these transition easily. The first part of an orchestration is the base state of the scene:



### Registering components

Using the `register` function returned from 

- Register multiple slots (with id's)


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

`
