import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { FC, ReactNode, Suspense, useEffect, useState } from "react";
import { Html, Stats, useProgress } from "@react-three/drei";
import { Scroll, useRegister } from "jongleur";
import { sceneAnimation } from "./keyframes";
import { range } from "jongleur/utils";
import { IconBrandGithub, IconArrowDown } from "@tabler/icons";
import ReactSlider from "react-slider";

// Simple full page loader, during scene setup
const Loader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-1">
        <p className="text-neutral text-lg">Loading</p>
        <progress className="progress bg-neutral w-56 progress-primary shadow-md"></progress>
      </div>
    </Html>
  );
};

const Code: FC<{ children: ReactNode }> = ({ children }) => (
  <code className="p-1 bg-base-300 rounded-md text-sm">{children}</code>
);

function App() {
  const register = useRegister(sceneAnimation);

  const [damping, setDamping] = useState(2);
  return (
    <div className="bg-base-100 h-[100vh] text-neutral">
      <Canvas frameloop="demand">
        {/* <Stats /> */}
        <Suspense fallback={<Loader />}>
          <Scroll.Controls orchestrate={sceneAnimation} damping={damping}>
            <Scroll.Snaps
              points={[0, 1, 2, 3, 4, 5].map(v => v + 0.5)}
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
                <div className="card bg-base-200 mr-4 mt-4 min-w-[400px]">
                  <div className="card-body">
                    <h1 className={"card-title"}>Welcome to the Demo of Jongleur 🤹</h1>
                    <p>
                      This demo shows off some of the features from the library! Check out the github for more
                      documentation and the full source-code of this demo:
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
                      This demo uses <Code>Scroll.Snaps</Code> to snap to scroll positions. These pages are indicated by
                      the markers on the left hand side.
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At at={1} align={"center"} placement={["end", "center"]}>
                <div className={"flex flex-col items-center mb-2 gap-[4px]"} ref={register("start")}>
                  <p>Start by scrolling</p>
                  <IconArrowDown className="animate-bounce" />
                </div>
              </Scroll.At>
              <Scroll.At at={1.5} align={"end"} placement={["center", "end"]}>
                <div className="card bg-base-200 mr-4 mt-4 min-w-[400px]">
                  <div className="card-body">
                    <h1 className={"card-title"}>
                      This library helps to <span className="italic contents">juggle</span> the difficulties of 3d and
                      DOM animations
                    </h1>
                    <p>
                      Using a keyframe inspired notation, you can orchestrate complex scene animations that work with{" "}
                      <Code>three.js</Code> objects and DOM Elements. The resulting clips can be applied and advanced by
                      any form of progress, such as scroll or time.
                    </p>
                    <p>
                      So far, you already saw these effects applied to this card and the "Start by scrolling" label on
                      the first page.
                    </p>
                    <p>
                      The real power of the library is combining this with animations in a 3d scene. You probably
                      already noticed the empty room, hopefully it wont be this empty on the next page...
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At at={2.5} align={"end"} placement={["center", "end"]}>
                <div className="card bg-base-200 mr-4 mt-4 min-w-[400px]" ref={register("third")}>
                  <div className={"card-body"}>
                    <h1 className={"card-title"}>There, that's ✨ better ✨</h1>
                    <p>
                      Per default, a damping effect is applied to the scroll progress, which ensures that the animation
                      remains smooth even when the scroll jumps around. As this is just a prop to the{" "}
                      <Code>Scroll.Controls</Code> Component, we can even change that based on user input. Here try for
                      yourself:
                    </p>
                    <span className="badge badge-primary">Damping: {damping}</span>
                    <ReactSlider
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={damping}
                      className={"w-full h-4 cursor-grab"}
                      trackClassName={"h-2 bg-base-300 rounded-md"}
                      thumbClassName={"rounded-full h-4 w-4 bg-primary -translate-x-1/2 -top-1 focus:outline-none"}
                      onChange={value => setDamping(value)}
                    />
                    <p className={"text-neutral-400 text-xs"}>Note: 0.1 is extremely slow 🐌 and 10 is snappy 🚀</p>
                    <p>
                      At least now the room is not that empty anymore, but{" "}
                      <span className={"contents italic"}>wait</span> there is more that we can do...
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At at={3.5} align={"end"} placement={["center", "end"]}>
                <div className="card bg-base-200 mr-4 mt-4 min-w-[400px]" ref={register("fourth")}>
                  <div className={"card-body"}>
                    <h1 className={"card-title"}>Did you see the chair? 😮</h1>
                    <p>
                      Animations can also modify multiple fields simultaneously and interleaved, such as the position,
                      rotation and scale of a <Code>three.js</Code> object.
                    </p>
                    <p className={"text-neutral-400 text-sm"}>
                      Hint: If that happened a bit to fast, try to go back and adjust the `damping` to a smaller value.
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At at={4.5} align={"end"} placement={["center", "end"]}>
                <div className="card bg-base-200 mr-4 mt-4 min-w-[400px]" ref={register("fifth")}>
                  <div className={"card-body"}>
                    <h1 className={"card-title"}>Animating lights and other object</h1>
                    <p>
                      The library provides a set of default fields to be animated. These include common fields for DOM
                      Elements and three.js elements like <Code>Object3D</Code>, <Code>Camera</Code>, <Code>Light</Code>{" "}
                      and their descendants.
                    </p>
                    <p>
                      Additionally, its extremely easy to add your own fields to work with your custom classes and
                      objects. The possibilities are endless...
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At at={5.5} align={"center"} placement={["start", "center"]}>
                <div className={"card glass w-[400px]"}>
                  <div className={"card-body"}>
                    <h1 className={"card-title"}>And thats it! </h1>
                    <p>
                      At least for now... There is a lot more to this library! Check out the documentation on{" "}
                      <a
                        href={"https://github.com/lucafanselau/jongleur"}
                        target={"_blank"}
                        rel={"noreferrer"}
                        className={"link"}
                      >
                        Github
                      </a>
                      . If you want to get involved, don't hesitate extending upon the library, opening issues or
                      discussions!
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
