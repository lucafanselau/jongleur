import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { FC, ReactNode, Suspense, useState } from "react";
import { Html } from "@react-three/drei";
import { Scroll, useRegister } from "jongleur";
import { clips } from "./keyframes";
import { range } from "jongleur";
import ReactSlider from "react-slider";

// Simple full page loader, during scene setup
const Loader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-1">
        <div role="status">
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-slate-200 animate-spin dark:text-slate-600 fill-slate-800 dark:fill-white"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-lg">Loading</p>
        {/* <progress className="bg-slate-200 w-56 shadow-md h-2 rounded-full"></progress> */}
      </div>
    </Html>
  );
};

const Code: FC<{ children: ReactNode }> = ({ children }) => (
  <code className="p-1 bg-base-300 rounded-md text-sm">{children}</code>
);

const Cards = [
  {
    heading: "Welcome to the Demo of Jongleur 🤹",
    content: (
      <>
        <p>
          This demo shows off some of the features from the library! Check out
          the github for more documentation and the full source-code of this
          demo:
        </p>
        <div className="card-actions">
          <a
            href={"https://github.com/lucafanselau/jongleur"}
            target={"_blank"}
            rel={"noreferrer"}
          >
            <button className="btn btn-primary btn-sm gap-2">
              {/* <IconBrandGithub /> */}
              Github
            </button>
          </a>
        </div>
        <p>
          This demo uses <Code>Scroll.Snaps</Code> to snap to scroll positions.
          These pages are indicated by the markers on the left hand side.
        </p>
      </>
    ),
  },
];

function Keyframes() {
  const register = useRegister(clips);

  const [damping, setDamping] = useState(2);
  return (
    <div className="h-full">
      <Canvas frameloop="demand">
        {/* <Stats /> */}
        <Suspense fallback={<Loader />}>
          <Scroll.Controls orchestrate={clips} damping={damping}>
            <Scroll.Snaps
              points={[0, 1, 2, 3, 4, 5].map((v) => v + 0.5)}
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
                <div className="block prose p-8 mr-4 min-w-[400px] rounded-lg border border-slate-200 shadow-md dark:border-slate-700 glass">
                  {/* bg-white  dark:bg-slate-800 */}
                  {/* <div className="card bg-base-200 mr-4 mt-4 min-w-[400px]"> */}
                  <h2>Welcome to the Demo of Jongleur 🤹</h2>
                  <p>
                    This demo shows off some of the features from the library!
                    Check out the documentation Check out the github for more
                    documentation and the full source-code of this demo:
                  </p>
                  <div className="flex items-center space-x-2">
                    <a
                      href={"https://github.com/lucafanselau/jongleur"}
                      target={"_blank"}
                      rel={"noreferrer"}
                    >
                      <button
                        type="button"
                        className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2"
                      >
                        <svg
                          className="mr-2 -ml-1 w-5 h-5 fill-white"
                          stroke="currentColor"
                          stroke-width="0"
                          viewBox="0 0 16 16"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.976 0A7.977 7.977 0 0 0 0 7.976c0 3.522 2.3 6.507 5.431 7.584.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076-.343-.93-.881-1.175-.881-1.175-.734-.489.048-.489.048-.489.783.049 1.224.832 1.224.832.734 1.223 1.859.88 2.3.685.048-.538.293-.88.489-1.076-1.762-.196-3.621-.881-3.621-3.964 0-.88.293-1.566.832-2.153-.05-.147-.343-.978.098-2.055 0 0 .685-.196 2.201.832.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832.44 1.077.146 1.908.097 2.104a3.16 3.16 0 0 1 .832 2.153c0 3.083-1.86 3.719-3.62 3.915.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.984 7.984 0 0 0 16 7.976C15.951 3.572 12.38 0 7.976 0z"
                          ></path>
                        </svg>
                        Github
                      </button>
                    </a>
                  </div>
                  <p>
                    This demo uses <Code>Scroll.Snaps</Code> to snap to scroll
                    positions. These pages are indicated by the markers on the
                    left hand side.
                  </p>
                </div>
              </Scroll.At>
              <Scroll.At at={1} align={"center"} placement={["end", "center"]}>
                <div
                  className={"flex flex-col items-center mb-2 gap-[4px]"}
                  ref={register("start")}
                >
                  <p>Start by scrolling</p>
                  <svg
                    className="w-6 h-6 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </Scroll.At>
              <Scroll.At at={1.5} align={"end"} placement={["center", "end"]}>
                <div className="card bg-base-200 mr-4 mt-4 min-w-[400px]">
                  <div className="card-body">
                    <h1 className={"card-title"}>
                      This library helps to{" "}
                      <span className="italic contents">juggle</span> the
                      difficulties of 3d and DOM animations
                    </h1>
                    <p>
                      Using a keyframe inspired notation, you can orchestrate
                      complex scene animations that work with{" "}
                      <Code>three.js</Code> objects and DOM Elements. The
                      resulting clips can be applied and advanced by any form of
                      progress, such as scroll or time.
                    </p>
                    <p>
                      So far, you already saw these effects applied to this card
                      and the "Start by scrolling" label on the first page.
                    </p>
                    <p>
                      The real power of the library is combining this with
                      animations in a 3d scene. You probably already noticed the
                      empty room, hopefully it wont be this empty on the next
                      page...
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At at={2.5} align={"end"} placement={["center", "end"]}>
                <div
                  className="card bg-base-200 mr-4 mt-4 min-w-[400px]"
                  ref={register("third")}
                >
                  <div className={"card-body"}>
                    <h1 className={"card-title"}>There, that's ✨ better ✨</h1>
                    <p>
                      Per default, a damping effect is applied to the scroll
                      progress, which ensures that the animation remains smooth
                      even when the scroll jumps around. As this is just a prop
                      to the <Code>Scroll.Controls</Code> Component, we can even
                      change that based on user input. Here try for yourself:
                    </p>
                    <span className="badge badge-primary">
                      Damping: {damping}
                    </span>

                    <input
                      id="steps-range"
                      type="range"
                      min="0"
                      max="5"
                      value="2.5"
                      step="0.5"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    {/* <ReactSlider
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={damping}
                        className={"w-full h-4 cursor-grab"}
                        trackClassName={"h-2 bg-base-300 rounded-md"}
                        thumbClassName={
                        "rounded-full h-4 w-4 bg-primary -translate-x-1/2 -top-1 focus:outline-none"
                        }
                        onChange={(value) => setDamping(value)}
                        /> */}
                    <p className={"text-slate-400 text-xs"}>
                      Note: 0.1 is extremely slow 🐌 and 10 is snappy 🚀
                    </p>
                    <p>
                      You can even disable damping for any object or even any
                      single animation in the scene.
                    </p>
                    <p>
                      At least now the room is not that empty anymore, but{" "}
                      <span className={"contents italic"}>wait</span> there is
                      more that we can do...
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At at={3.5} align={"end"} placement={["center", "end"]}>
                <div
                  className="card bg-base-200 mr-4 mt-4 min-w-[400px]"
                  ref={register("fourth")}
                >
                  <div className={"card-body"}>
                    <h1 className={"card-title"}>Did you see the chair? 😮</h1>
                    <p>
                      Animations can also modify multiple fields simultaneously
                      and interleaved, such as the position, rotation and scale
                      of a <Code>three.js</Code> object.
                    </p>
                    <p className={"text-slate-400 text-sm"}>
                      Hint: If that happened a bit to fast, try to go back and
                      adjust the `damping` to a smaller value.
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At at={4.5} align={"end"} placement={["center", "end"]}>
                <div
                  className="card bg-base-200 mr-4 mt-4 min-w-[400px]"
                  ref={register("fifth")}
                >
                  <div className={"card-body"}>
                    <h1 className={"card-title"}>
                      Animating lights and other object
                    </h1>
                    <p>
                      The library provides a set of default fields to be
                      animated. These include common fields for DOM Elements and
                      three.js elements like <Code>Object3D</Code>,{" "}
                      <Code>Camera</Code>, <Code>Light</Code> and their
                      descendants.
                    </p>
                    <p>
                      Additionally, its extremely easy to add your own fields to
                      work with your custom classes and objects. The
                      possibilities are endless...
                    </p>
                  </div>
                </div>
              </Scroll.At>
              <Scroll.At
                at={5.5}
                align={"center"}
                placement={["start", "center"]}
              >
                <div className={"card glass w-[400px]"}>
                  <div className={"card-body"}>
                    <h1 className={"card-title"}>And thats it! </h1>
                    <p>
                      At least for now... There is a lot more to this library!
                      Check out the documentation on{" "}
                      <a
                        href={"https://github.com/lucafanselau/jongleur"}
                        target={"_blank"}
                        rel={"noreferrer"}
                        className={"link"}
                      >
                        Github
                      </a>
                      . If you want to get involved, don't hesitate extending
                      upon the library, opening issues or discussions!
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
export default Keyframes;
