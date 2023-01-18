import { Canvas } from "@react-three/fiber";
import { Scroll, useRegister, useThreeCamera } from "jongleur";
import { Suspense } from "react";
import { clips } from "./clips";
import { Loader } from "./utils";
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
  return (
    <Scroll.Controls clips={clips} damping={1}>
      <Scroll.Html fixed>
        <Text />
      </Scroll.Html>

      <Scroll.Snaps points={[0, 0.5, 1, 2, 3].map(v => v + 0.5)} snapType={"mandatory"} />
    </Scroll.Controls>
  );
};

function App() {
  return (
    <div className="container">
      <Canvas frameloop="demand">
        {/* <Stats /> */}
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
