import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Html, Stats, useProgress } from "@react-three/drei";
import { Scroll } from "jongleur";
import { sceneAnimation } from "./keyframes";
import { range } from "jongleur/utils";
import { IconBrandGithub } from "@tabler/icons";

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
    <div className="bg-base-100 h-[100vh] text-neutral">
      <Canvas frameloop="demand">
        {/* <Stats /> */}
        <Suspense fallback={<Loader />}>
          <Scroll.Controls orchestrate={sceneAnimation} damping={15}>
            <Scroll.Snaps
              points={[0, 1, 2, 3].map(v => v + 0.5)}
              align={"center"}
              marker={(_, i) => (
                <div className={"flex flex-col space-y-2 ml-4"}>
                  {range(0, i + 1).map((_, i) => (
                    <div className={"w-3 h-3 bg-primary rounded-xl"} key={i} />
                  ))}
                </div>
              )}
            />
            <Scroll.Html>
              <Scroll.At at={0.5} align={"end"} placement={["center", "end"]}>
                <div className="card bg-base-200 mr-4 min-w-[300px]">
                  <div className="card-body">
                    <h1 className={"card-title"}>Welcome to the Demo of Jongleur 🤹</h1>
                    <p>
                      This demo shows off some of the features from the library! Check out the github for more
                      documentation and the full source-code of this demo
                    </p>
                    <div className="card-actions">
                      <a href={"https://github.com/lucafanselau/jongleur"} target={"_blank"} rel={"noreferrer"}>
                        <button className="btn btn-primary btn-sm gap-2">
                          <IconBrandGithub />
                          Github
                        </button>
                      </a>
                    </div>
                    <p>
                      This demo uses <code className="p-1 bg-base-300 rounded-md text-sm">Scroll.Snaps</code> to snap to
                      scroll positions. These pages are indicated by the markers on the left hand side.
                    </p>
                  </div>
                </div>
              </Scroll.At>
            </Scroll.Html>
            <Scene />
          </Scroll.Controls>
        </Suspense>
      </Canvas>
    </div>
  );
}
export default App;
