---
id: "index"
title: "jongleur"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Type Aliases

### Actions

Ƭ **Actions**<`Fields`, `Base`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `setLastProgress` | (`progress`: `number`) => `void` |
| `setSlot` | <Obj\>(`obj`: `Obj`, `target`: [`TargetFromBase`](#targetfrombase)<`Fields`, `Base`, `Obj`\> \| ``null``, `id`: `string`) => `void` |

#### Defined in

[store.ts:22](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/store.ts#L22)

___

### Clip

Ƭ **Clip**<`Store`\>: `Object`

A clip represents a single transition sequence for a Field Store

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Store` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | `Required`<[`ClipConfig`](#clipconfig)\> |
| `end` | [`number`, `Store`] |
| `start` | [`number`, `Store`] |

#### Defined in

[orchestrate/types.ts:55](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L55)

___

### ClipConfig

Ƭ **ClipConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `damping?` | `boolean` |
| `interpolation?` | [`Interpolation`](#interpolation) |

#### Defined in

[orchestrate/config.ts:3](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/config.ts#L3)

___

### ClipStore

Ƭ **ClipStore**<`Fields`, `Base`\>: `ReturnType`<typeof [`createClipStore`](#createclipstore)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Defined in

[store.ts:27](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/store.ts#L27)

___

### ClipsConfig

Ƭ **ClipsConfig**: [`ObjectConfig`](#objectconfig) & { `length?`: `number`  }

#### Defined in

[orchestrate/config.ts:12](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/config.ts#L12)

___

### DefaultFields

Ƭ **DefaultFields**: typeof [`defaultFields`](#defaultfields-1)

#### Defined in

[orchestrate/fields.ts:67](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/fields.ts#L67)

___

### FieldDefinition

Ƭ **FieldDefinition**<`Target`, `Store`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `Target` |
| `Store` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apply` | (`target`: `Target`, `a`: `Store`, `b`: `Store`, `alpha`: `number`) => `void` |

#### Defined in

[orchestrate/types.ts:6](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L6)

___

### FieldKeyframeState

Ƭ **FieldKeyframeState**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [`ClipConfig`](#clipconfig) |
| `value` | `T` |

#### Defined in

[orchestrate/types.ts:42](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L42)

___

### FieldsBase

Ƭ **FieldsBase**: `Object`

#### Index signature

▪ [K: `string`]: [`FieldDefinition`](#fielddefinition)<`any`, `any`\>

#### Defined in

[orchestrate/types.ts:10](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L10)

___

### HandleProgress

Ƭ **HandleProgress**: (`progress`: `number`) => `void`

#### Type declaration

▸ (`progress`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `progress` | `number` |

##### Returns

`void`

#### Defined in

[orchestrate/types.ts:81](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L81)

___

### Interpolation

Ƭ **Interpolation**: ``"linear"`` \| ``"ease-in"`` \| ``"ease-out"`` \| ``"ease-in-out"`` \| ``"start"`` \| ``"end"``

#### Defined in

[progress/interpolation.ts:1](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/progress/interpolation.ts#L1)

___

### KeyframeDefinition

Ƭ **KeyframeDefinition**<`Fields`, `Base`\>: { [O in keyof Base]: Object }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Defined in

[orchestrate/types.ts:48](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L48)

___

### Keyframes

Ƭ **Keyframes**<`Fields`, `Base`\>: { [O in keyof Base]: Object }

The parsed keyframes, that are computed by the orchestrate function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Defined in

[orchestrate/types.ts:64](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L64)

___

### ObjectConfig

Ƭ **ObjectConfig**: [`ClipConfig`](#clipconfig) & {}

#### Defined in

[orchestrate/config.ts:8](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/config.ts#L8)

___

### ObjectsForTarget

Ƭ **ObjectsForTarget**<`Target`, `Fields`, `Base`\>: { [K in keyof Base]: Target extends TargetFromBase<Fields, Base, K\> ? K : never }[keyof `Base`]

This type returns all objects in `Base` which would be satisfied by type `Target`. This is a really helpful type
if you want to define reusable functionality for a scene object and only want the caller to be able to provide
object with a specific target type.

For future reference this type is loosely inspired by:
https://stackoverflow.com/questions/60291002/can-typescript-restrict-keyof-to-a-list-of-properties-of-a-particular-type

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Target` | `Target` |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Defined in

[orchestrate/types.ts:93](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L93)

___

### Register

Ƭ **Register**<`Fields`, `Base`\>: <Obj\>(`obj`: `Obj`, `id?`: `string`) => `RefCallback`<[`TargetFromBase`](#targetfrombase)<`Fields`, `Base`, `Obj`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Type declaration

▸ <`Obj`\>(`obj`, `id?`): `RefCallback`<[`TargetFromBase`](#targetfrombase)<`Fields`, `Base`, `Obj`\>\>

The type for the register callback .This is a function, that for every object (Obj) in the scene returns a RefCallback
of the required TargetType (inferred through the `TargetFromBase` utility). If the object specifies multiple fields to
be modified, this will be the Intersection type of all fields

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Obj` | extends keyof `Base` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `Obj` |
| `id?` | `string` |

##### Returns

`RefCallback`<[`TargetFromBase`](#targetfrombase)<`Fields`, `Base`, `Obj`\>\>

#### Defined in

[orchestrate/types.ts:76](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L76)

___

### StateBase

Ƭ **StateBase**<`Fields`\>: `Object`

Typing for the definition of the Base scene

This is generic over the specific Fields (which mostly should be `typeof defaultFields` from `./fields.ts`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |

#### Index signature

▪ [K: `string`]: { [F in keyof Fields]?: StoreFromFields<Fields, F\> } & { `config?`: [`ObjectConfig`](#objectconfig)  }

#### Defined in

[orchestrate/types.ts:38](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L38)

___

### Store

Ƭ **Store**<`Fields`, `Base`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `base` | `Base` |
| `fields` | `Fields` |
| `keyframes` | [`Keyframes`](#keyframes)<`Fields`, `Base`\> |
| `last` | `number` |
| `length` | `number` |
| `objects` | keyof `Base`[] |
| `slots` | { [Obj in keyof Base]?: Object } |

#### Defined in

[store.ts:7](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/store.ts#L7)

___

### TargetFromBase

Ƭ **TargetFromBase**<`Fields`, `Base`, `Obj`\>: `ApplyFunctionForField`<`Fields`, keyof `Base`[`Obj`]\> extends (`i`: infer I, ...`other`: `any`[]) => `void` ? `I` : `never`

Utility Type to the field target for an object (Obj) in the Scene (specified by Base)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |
| `Obj` | extends keyof `Base` |

#### Defined in

[orchestrate/types.ts:26](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/types.ts#L26)

## Variables

### InheritSymbol

• `Const` **InheritSymbol**: unique `symbol`

#### Defined in

[orchestrate/utils.ts:4](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/utils.ts#L4)

___

### Scroll

• `Const` **Scroll**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `At` | `FC`<`AtProps`\> |
| `Controls` | <Fields, Base\>(`__namedParameters`: { `children`: `ReactNode` ; `damping?`: `number` ; `orchestrate`: `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\>  }) => ``null`` \| `ReactElement`<`any`, `any`\> |
| `Html` | `FC`<{ `children`: `ReactNode`  }\> |
| `Snaps` | `FC`<`SnapsProps`\> |

#### Defined in

[scroll/index.ts:5](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/scroll/index.ts#L5)

___

### defaultDOMFields

• `Const` **defaultDOMFields**: `Object`

A default implementation of fields to be used for DOM elements

If you feel like one of your custom fields, should be usable for everybody, don't hesitate
to open a pull request

#### Type declaration

| Name | Type |
| :------ | :------ |
| `opacity` | [`FieldDefinition`](#fielddefinition)<`HTMLElement`, `number`\> |
| `translate` | [`FieldDefinition`](#fielddefinition)<`HTMLElement`, [`LengthOrPercentage`, `LengthOrPercentage`]\> |

#### Defined in

[orchestrate/fields.ts:51](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/fields.ts#L51)

___

### defaultFields

• `Const` **defaultFields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `intensity` | [`FieldDefinition`](#fielddefinition)<`Light`, `number`\> |
| `lookAt` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> |
| `opacity` | [`FieldDefinition`](#fielddefinition)<`HTMLElement`, `number`\> |
| `position` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> |
| `rotation` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> |
| `scale` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> |
| `translate` | [`FieldDefinition`](#fielddefinition)<`HTMLElement`, [`LengthOrPercentage`, `LengthOrPercentage`]\> |
| `visible` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `boolean`\> |

#### Defined in

[orchestrate/fields.ts:62](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/fields.ts#L62)

___

### defaultObjectConfig

• `Const` **defaultObjectConfig**: `Required`<[`ObjectConfig`](#objectconfig)\>

#### Defined in

[orchestrate/config.ts:16](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/config.ts#L16)

___

### defaultThreeFields

• `Const` **defaultThreeFields**: `Object`

A default implementation of fields to be used in a r3f context

If you feel like one of your custom fields, should be usable for everybody, don't hesitate
to open a pull request

#### Type declaration

| Name | Type |
| :------ | :------ |
| `intensity` | [`FieldDefinition`](#fielddefinition)<`Light`, `number`\> |
| `lookAt` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> |
| `position` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> |
| `rotation` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> |
| `scale` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> |
| `visible` | [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `boolean`\> |

#### Defined in

[orchestrate/fields.ts:26](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/fields.ts#L26)

___

### helpers

• `Const` **helpers**: `Object`

Utilities to be used to create keyframe clips

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inherit` | `symbol` |
| `state` | <T\>(`value`: `T`, `interpolation?`: [`Interpolation`](#interpolation), `damping?`: `boolean`) => [`FieldKeyframeState`](#fieldkeyframestate)<`T`\> |

#### Defined in

[orchestrate/utils.ts:9](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/utils.ts#L9)

## Functions

### createClipStore

▸ **createClipStore**<`Fields`, `Base`\>(`initial`): `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `initial` | `Omit`<[`Store`](#store)<`Fields`, `Base`\>, ``"slots"`` \| ``"last"``\> |

#### Returns

`UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\>

#### Defined in

[store.ts:31](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/store.ts#L31)

___

### createField

▸ **createField**<`Target`, `Store`\>(`apply`): [`FieldDefinition`](#fielddefinition)<`Target`, `Store`\>

#### Type parameters

| Name |
| :------ |
| `Target` |
| `Store` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `apply` | (`obj`: `Target`, `a`: `Store`, `b`: `Store`, `alpha`: `number`) => `void` |

#### Returns

[`FieldDefinition`](#fielddefinition)<`Target`, `Store`\>

#### Defined in

[orchestrate/fields.ts:7](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/fields.ts#L7)

___

### createOrchestrate

▸ **createOrchestrate**<`Fields`\>(`fields`): <Base\>(`base`: `Base`, `definition`: [`KeyframeDefinition`](#keyframedefinition)<`Fields`, `Base`\>, `config`: [`ClipsConfig`](#clipsconfig)) => `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\>

Create a new orchestration function that allows for custom fields to be included in the scene

You probably want to use the provided `orchestrate` function from the library. This function is intended
for advanced use cases, where the default fields provided in `./fields.ts` are not enough.

You can refer to the top-level guide in `README.md` or look at the default implementation of this function in `field.ts` for usage
examples

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields` | `Fields` |

#### Returns

`fn`

▸ <`Base`\>(`base`, `definition`, `config`): `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `base` | `Base` |
| `definition` | [`KeyframeDefinition`](#keyframedefinition)<`Fields`, `Base`\> |
| `config` | [`ClipsConfig`](#clipsconfig) |

##### Returns

`UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\>

#### Defined in

[orchestrate/parse.ts:103](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/parse.ts#L103)

___

### interpolate

▸ **interpolate**(`type`, `value`): `number`

Get the interpolation function for a linear offset between 0..1

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`Interpolation`](#interpolation) |
| `value` | `number` |

#### Returns

`number`

#### Defined in

[progress/interpolation.ts:16](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/progress/interpolation.ts#L16)

___

### orchestrate

▸ **orchestrate**<`Base`\>(`base`, `definition`, `config`): `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<{ `intensity`: [`FieldDefinition`](#fielddefinition)<`Light`, `number`\> ; `lookAt`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `opacity`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, `number`\> ; `position`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `rotation`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `scale`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `translate`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, [`LengthOrPercentage`, `LengthOrPercentage`]\> ; `visible`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `boolean`\>  }, `Base`\> & [`Actions`](#actions)<{ `intensity`: [`FieldDefinition`](#fielddefinition)<`Light`, `number`\> ; `lookAt`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `opacity`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, `number`\> ; `position`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `rotation`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `scale`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `translate`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, [`LengthOrPercentage`, `LengthOrPercentage`]\> ; `visible`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `boolean`\>  }, `Base`\>\>\>\>

The default orchestration function using the fields

This is a specalization of the `createOrchestrate` function, tailored to be suitable in
most r3f context

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Base` | extends [`StateBase`](#statebase)<{ `intensity`: [`FieldDefinition`](#fielddefinition)<`Light`, `number`\> ; `lookAt`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `opacity`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, `number`\> ; `position`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `rotation`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `scale`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `translate`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, [`LengthOrPercentage`, `LengthOrPercentage`]\> ; `visible`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `boolean`\>  }\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `base` | `Base` | The base definition of the scene |
| `definition` | [`KeyframeDefinition`](#keyframedefinition)<{ `intensity`: [`FieldDefinition`](#fielddefinition)<`Light`, `number`\> ; `lookAt`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `opacity`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, `number`\> ; `position`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `rotation`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `scale`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `translate`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, [`LengthOrPercentage`, `LengthOrPercentage`]\> ; `visible`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `boolean`\>  }, `Base`\> | The keyframes that define the timeline |
| `config` | [`ClipsConfig`](#clipsconfig) | - |

#### Returns

`UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<{ `intensity`: [`FieldDefinition`](#fielddefinition)<`Light`, `number`\> ; `lookAt`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `opacity`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, `number`\> ; `position`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `rotation`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `scale`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `translate`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, [`LengthOrPercentage`, `LengthOrPercentage`]\> ; `visible`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `boolean`\>  }, `Base`\> & [`Actions`](#actions)<{ `intensity`: [`FieldDefinition`](#fielddefinition)<`Light`, `number`\> ; `lookAt`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `opacity`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, `number`\> ; `position`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `rotation`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `scale`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `Vector3`\> ; `translate`: [`FieldDefinition`](#fielddefinition)<`HTMLElement`, [`LengthOrPercentage`, `LengthOrPercentage`]\> ; `visible`: [`FieldDefinition`](#fielddefinition)<`Object3D`<`Event`\>, `boolean`\>  }, `Base`\>\>\>\>

#### Defined in

[orchestrate/parse.ts:104](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/orchestrate/parse.ts#L104)

___

### useProgress

▸ **useProgress**<`Fields`, `Base`\>(`store`, `damping?`, `eps?`): [`HandleProgress`](#handleprogress)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `store` | `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\> | `undefined` |
| `damping?` | `number` | `undefined` |
| `eps` | `number` | `1e-2` |

#### Returns

[`HandleProgress`](#handleprogress)

#### Defined in

[progress/progress.ts:9](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/progress/progress.ts#L9)

___

### useRegister

▸ **useRegister**<`Fields`, `Base`\>(`store`): [`Register`](#register)<`Fields`, `Base`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\> |

#### Returns

[`Register`](#register)<`Fields`, `Base`\>

#### Defined in

[progress/register.ts:7](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/progress/register.ts#L7)

___

### useThreeCamera

▸ **useThreeCamera**<`Fields`, `Base`, `Obj`\>(`store`, `obj`, `id?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |
| `Obj` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\> |
| `obj` | `Obj` |
| `id?` | `string` |

#### Returns

`void`

#### Defined in

[progress/hooks.ts:9](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/progress/hooks.ts#L9)

___

### useTimeProgress

▸ **useTimeProgress**(`progress`, `loop`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `progress` | [`HandleProgress`](#handleprogress) |
| `loop` | `number` |

#### Returns

`void`

#### Defined in

[progress/hooks.ts:28](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/progress/hooks.ts#L28)

___

### useUndampedProgress

▸ **useUndampedProgress**<`Fields`, `Base`\>(`store`): [`HandleProgress`](#handleprogress)

A progress hook that can be used outside of an R3F Canvas component

Due to a missing frameloop, this progress ignores the ~damping~ setting and
applies progress directly

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Fields` | extends [`FieldsBase`](#fieldsbase) |
| `Base` | extends [`StateBase`](#statebase)<`Fields`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `UseBoundStore`<`WithImmer`<`StoreApi`<[`Store`](#store)<`Fields`, `Base`\> & [`Actions`](#actions)<`Fields`, `Base`\>\>\>\> |

#### Returns

[`HandleProgress`](#handleprogress)

#### Defined in

[progress/progress.ts:98](https://github.com/lucafanselau/jongleur/blob/9e1dd84/src/progress/progress.ts#L98)
