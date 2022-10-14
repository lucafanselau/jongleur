# Using and defining keyframes

To utilize this library one must understand how keyframes are parsed into transitions. For the sake of this implementation we will consider a scene with a single *object* which is the camera:

```typescript
import { orchestrate } from "jongleur";
import { Vector3 } from "three";

const result = orchestrate({
    camera: {
        position: new Vector3(0, 2, 0),
        lookAt: new Vector3(0, 0, 0)
    }
}, { ... })
```

We therefore define a simple scene with a camera, that gets initialized to be at `[ 0, 2, 0 ]` and looks at the center of the scene `[ 0, 0, 0 ]`. 

- TODO: register camera
