import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Html, useProgress } from "@react-three/drei";
import { Scroll } from "jongleur";
import { progress, store } from "./keyframes";

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
          <Scroll.Controls orchestrate={store}>
            <Scroll.Snaps
              points={[0, 1, 2, 3]}
              align={"start"}
              marker={<div className={"w-3 h-3 bg-primary rounded-xl ml-4 mt-4"} />}
            />
            <Scene />
            {/* <Scroll.Scrolled>
                <p>Hello world</p>
                <p style={{ position: "absolute", top: "100vh" }}>Hello world</p>
                </Scroll.Scrolled>
                <Scroll.Snaps points={[0, 1, 2].map(v => v + 0.5)} /> */}
          </Scroll.Controls>
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
