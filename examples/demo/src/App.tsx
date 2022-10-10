import Scene from "./scene";
import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <div className="bg-gray-200 h-[100vh]">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}
export default App;
