
# Performance pitfalls and best practices

## Dynamically adding lights to the scene

If any of the objects controlled by the library are lights or parents of lights, there is a performance hit associated with toggling the `visible` field for the first time. For me, that was around 200ms for "enabling" two lights. This is due to a shader program load in WebGL. (The solution is, just not doing that :), instead try to have the intensity at zero!
