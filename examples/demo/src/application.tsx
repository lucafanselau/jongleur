import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";

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
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
