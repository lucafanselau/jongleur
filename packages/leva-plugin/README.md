# @jongleur/leva

!DISCLAIMER: This is currently a very early WIP. basically just dont use it yet.

This is an idea to provide leva plugins to greatly enhance DX. Atm this seems to be (at the very least) difficult to implement, since leva does not export enough components and utility functions to custom plugins to build a cool thing here. I definitely want to extend on the idea though and maybe in the future this module could provide the following to plugins:

## Seeker

```typescript
const { s } = useControls({ s: seeker({ seek }) });
```

This would provide an easy way to the following functions:

- Play / Pause
- Step (with modifiable step size)
- Custom playback speed

## Timeline

Visual component that list the parsed clips from the timeline for every object (more of an development tool)
