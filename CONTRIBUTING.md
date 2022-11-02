# Contribute to *jongleur*

## Project setup

## Run example locally

## Project setup

Generally the project is implemented as a monorepo. The most important package is the root package (which for pnpm is not normal behavior, but do-able through our `.npmrc`). This is the library that gets build and packaged to the npm registry. The source resides under `src` and test under `test`. 

The source of the library is structured into multiple folders:
- **scroll**: Mostly react specific code to enable the playback of *clips* via a scrolling interface + utilities
- **orchestrate**: Everything that is concerned with the transformation of keyframes into clips (or rather a clips-store (since the main deliverable of this module is a `zustand` store))
- **progress**: Concerned with taking whats in the clips store and applying on an actual scene or DOM (most prominently the `useClips` or `useRegister` hook)
- **store**: The clips and its definition + associated types

When adding files to the project, try to adhear to this general layout of files

### Example(s)

To quickly test changes to the library, the monorepo contains a `vite` react project configured to work with updates in the code base in real time.

(Note: skip this if you don't care)
The example does not actually depend on the library. 
