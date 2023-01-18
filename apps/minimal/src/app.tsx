import { Float, Sparkles } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Scroll, useRegister, useThreeCamera } from "jongleur";
import { Suspense } from "react";
import { clips } from "./clips";
import { Loader } from "./utils";
import useSpline from "@splinetool/r3f-spline";
const Text = () => {
  const register = useRegister(clips);
  return (
    <div className="  ">
      <div className=" text1 " ref={register("sectionOne")}>
        TEXT 1
      </div>
      <div className=" text2" ref={register("sectionTwo")}>
        TEXT 2
      </div>
      <div className="text3" ref={register("sectionThree")}>
        TEXT 3
      </div>
    </div>
  );
};

const Scene = () => {
  const register = useRegister(clips);
  useThreeCamera(clips, "camera");

  const { nodes, materials } = useSpline("https://prod.spline.design/z-06FhWRsu5yzGTC/scene.splinecode");
  return (
    <>
      <Scroll.Controls clips={clips} damping={1}>
        <Scroll.Html fixed>
          <Text />
        </Scroll.Html>

        <Scroll.Snaps points={[0, 0.5, 1, 2, 3].map(v => v + 0.5)} snapType={"proximity"} />
        <color attach="background" args={["#000000"]} />
        <Float speed={1} rotationIntensity={2} floatIntensity={1} floatingRange={[1, 10]}>
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
              <Float
                speed={1} // Animation speed, defaults to 1
                rotationIntensity={1} // XYZ rotation intensity, defaults to 1
                floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                floatingRange={[1, 2]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
              >
                <mesh
                  name="Torus"
                  geometry={nodes.Torus.geometry}
                  material={materials["Torus Material"]}
                  receiveShadow
                  position={[0, 5.79, -6.16]}
                  rotation={[-0.89, 0, 1.16]}
                  scale={1}
                />
              </Float>
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
        </Float>
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
        <Sparkles noise={1} count={200} scale={200} size={200} speed={3} position={[0, 0, 5]} color={"gold"} />
        {/* -------------------------3D Scene End--------------- */}
      </Scroll.Controls>
    </>
  );
};

function App() {
  return (
    <div className="container">
      <Canvas frameloop="demand" shadows flat linear dpr={[1, 2]} camera={{ fov: 50 }}>
        {/* <Stats /> */}
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
