import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";
import { Scrollable, ScrollOverlay } from "jongleur";
import { progress } from "./keyframes";

// Simple full page loader, during scene setup
const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-1">
        <p className="text-accent text-lg">Loading</p>
        <progress className="progress bg-secondary w-56 progress-accent"></progress>
      </div>
    </Html>
  );
};

function App() {
  return (
    <div className="bg-neutral h-[100vh]">
      <Canvas>
        <Suspense fallback={<Loader />}>
          <ScrollOverlay pages={2} progress={progress}>
            <Scene />
            <Scrollable>
              <p>Hello world</p>
              <p style={{ position: "absolute", top: "100vh" }}>Hello world</p>
            </Scrollable>
          </ScrollOverlay>
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
