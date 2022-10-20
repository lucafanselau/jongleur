import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";
import { Scroll } from "jongleur";
import { progress } from "./keyframes";

// Simple full page loader, during scene setup
const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-1">
        <p className="text-neutral text-lg">Loading</p>
        <progress className="progress bg-neutral w-56 progress-primary shadow-md"></progress>
      </div>
    </Html>
  );
};

function App() {
  return (
    <div className="bg-base-100 h-[100vh]">
      <Canvas frameloop="demand">
        <Suspense fallback={<Loader />}>
          <Scroll pages={4} progress={progress}>
            <Scene />
            <Scroll.Scrolled>
              <p>Hello world</p>
              <p style={{ position: "absolute", top: "100vh" }}>Hello world</p>
            </Scroll.Scrolled>
          </Scroll>
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
