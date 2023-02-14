import { Html, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import useSpline from "@splinetool/r3f-spline";
import { useControls } from "leva";
import { damp } from "maath/easing";
import { Suspense } from "react";
import { refs, seek } from "./clips";
import { Loader } from "./utils";
import { Scroll } from "jongleur";
import { seeker } from "@jongleur/leva";

const Text = () => {
  return (
    <div className={"texts"}>
      <p className={"text"} ref={refs.sectionOne()}>
        TEXT 1
      </p>
      <p className={"text"} ref={refs.sectionTwo()}>
        TEXT 2
      </p>
      <p className={"text"} ref={refs.sectionThree()}>
        TEXT 3
      </p>
    </div>
  );
};

const Scene = () => {
  const { nodes, materials } = useSpline("https://prod.spline.design/z-06FhWRsu5yzGTC/scene.splinecode");

  const { progress, s } = useControls({ progress: { value: 0, min: 0, max: 1 }, s: seeker({ seek }) });

  /* useFrame((_, delta) => {
   *   damp(seek, "current", progress, 2, delta);
   * }); */

  /* useEffect(() => {
   *   seek.current = progress;
   * }, [progress]); */

  return (
    <>
      <color attach="background" args={["#000"]} />
      {/* -------------------------3D Scene Start--------------- */}
      <mesh
        name="Rectangle"
        geometry={nodes.Rectangle.geometry}
        material={materials["Rectangle Material"]}
        castShadow
        position={[13.83, -31.18, -60.14]}
        rotation={[-0.07, 0.09, 0]}
        scale={1}
      />
      <group dispose={null}>
        <group name="Group" position={[5.3, 25.35, 15.72]}>
          <mesh
            name="Torus"
            geometry={nodes.Torus.geometry}
            material={materials["Torus Material"]}
            receiveShadow
            position={[0, 5.79, -6.16]}
            rotation={[-0.89, 0, 1.16]}
            scale={1}
          />
        </group>
        <group name="scene" />
        <spotLight
          //  ref={register('box')}
          name="Spot Light 3"
          castShadow
          intensity={5}
          angle={Math.PI / 6}
          penumbra={1}
          distance={200}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-fov={119.99999999999999}
          shadow-camera-near={100}
          shadow-camera-far={100000}
          color="#fecf00"
          position={[0, -84.65, 22.5]}
          rotation={[0, 0, Math.PI]}
          scale={[1, 1, 1.6]}
        />
        <spotLight
          name="Spot Light 2"
          castShadow
          intensity={10}
          angle={1.4}
          penumbra={1}
          distance={10}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-fov={119.99999999999999}
          shadow-camera-near={100}
          shadow-camera-far={100000}
          color="#fecc00"
          position={[18.14, 22.05, 21.48]}
          rotation={[1.93, -0.3, -0.33]}
          scale={1}
        />
        <spotLight
          name="Spot Light"
          castShadow
          intensity={10}
          angle={Math.PI / 2}
          penumbra={1}
          distance={10}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-fov={119.99999999999999}
          shadow-camera-near={100}
          shadow-camera-far={100000}
          color="#fecc00"
          position={[7.43, 22, 25.9]}
          rotation={[1.82, -0.26, -0.36]}
        />
        <mesh
          name="untitled2"
          geometry={nodes.untitled2.geometry}
          material={nodes.untitled2.material}
          castShadow
          receiveShadow
          position={[0, -49.72, 0]}
        />
      </group>
      <pointLight
        name="Point Light"
        castShadow
        intensity={3}
        distance={2000}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={100}
        shadow-camera-far={100000}
        position={[77.35, 83.76, 6.98]}
        scale={[1, 1, 1.64]}
      />
      {/* <Sparkles noise={1} count={200} scale={200} size={200} speed={3} position={[0, 0, 5]} color={"gold"} /> */}
      {/* -------------------------3D Scene End--------------- */}
      {/* <Html center>
        <Text />
      </Html> */}
    </>
  );
};

function App() {
  return (
    <div className="container">
      <Canvas linear shadows>
        {/* <Stats /> */}
        <PerspectiveCamera ref={refs.camera()} makeDefault matrixWorldAutoUpdate />
        <Suspense fallback={<Loader />}>
          <Scroll.Controls seeker={seek} pages={3}>
            <Scene />
          </Scroll.Controls>
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
