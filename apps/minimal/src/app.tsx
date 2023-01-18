import { Canvas } from "@react-three/fiber";
import { useRegister } from "jongleur";
import { Suspense } from "react";
import { clips } from "./clips";
import { Loader } from "./utils";

function App() {
  const register = useRegister(clips);

  return (
    <div className="bg-base-100 h-[100vh] text-neutral">
      <Canvas frameloop="demand">
        {/* <Stats /> */}
        <Suspense fallback={<Loader />}></Suspense>
      </Canvas>
    </div>
  );
}
export default App;
