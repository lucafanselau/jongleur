import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";
import { ScrollOverlay } from "jongleur";
import { progress } from "./keyframes";

// Simple full page loader, during scene setup
const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <progress className="progress w-56 progress-accent"></progress>
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
          </ScrollOverlay>
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
