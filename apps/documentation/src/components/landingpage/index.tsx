import Scene from "./scene";
import { Canvas } from "@react-three/fiber";
import { FC, ReactNode, Suspense, useMemo, useState } from "react";
import { Scroll, useRegister } from "jongleur";
import { clips } from "./keyframes";
import { range } from "jongleur";
import { GithubButton, Loader, Code, DocumentationButton } from "./utils";
import ReactSlider from "react-slider";
import DarkToggle from "@components/utils/dark-toggle";
import clsx from "clsx";
import { createLandingpageContent } from "./content";

function Keyframes() {
  const register = useRegister(clips);

  const [damping, setDamping] = useState(2);

  const Cards = useMemo(
    () => createLandingpageContent(damping, setDamping),
    [setDamping, damping]
  );

  return (
    <Canvas frameloop="demand">
      {/* <Stats /> */}
      <Suspense fallback={<Loader />}>
        <Scroll.Controls clips={clips} damping={damping}>
          <Scroll.Snaps
            points={[0, 1, 2, 3, 4, 5].map((v) => v + 0.5)}
            align={"center"}
            marker={(_, i) => (
              <div className={"flex flex-col space-y-2 ml-4"}>
                {range(0, i + 1).map((_, i) => (
                  <div className={"w-3 h-3 bg-current rounded-xl"} key={i} />
                ))}
              </div>
            )}
          />
          <Scroll.Html>
            {Cards.map(
              ({ at, heading, content, align, placement, className, key }) => {
                const pl = placement ?? ["center", "end"];
                return (
                  <Scroll.At at={at} align={align ?? "end"} placement={pl}>
                    <div
                      ref={key !== undefined ? register(key) : undefined}
                      className={clsx(
                        "block p-8 min-w-[400px] rounded-lg border border-slate-300 dark:border-slate-700 shadow-md glass lg:scale-100 scale-75 transform-gpu",
                        pl[1] === "end" && "mr-8",
                        pl[1] === "end" ? "origin-right" : "origin-bottom",
                        className
                      )}
                    >
                      <div className="flex flex-col space-y-2">
                        <h2 className="text-2xl font-bold">{heading}</h2>
                        {content}
                      </div>
                    </div>
                  </Scroll.At>
                );
              }
            )}
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
          </Scroll.Html>
          <Scroll.Html fixed>
            <Scroll.At at={0} align={"start"} placement={["start", "start"]}>
              <div
                className={
                  "mt-4 ml-4 bg-slate-200 dark:bg-slate-800 rounded-lg shadow-md"
                }
              >
                <DocumentationButton />
              </div>
            </Scroll.At>
          </Scroll.Html>
          <Scene />
        </Scroll.Controls>
      </Suspense>
    </Canvas>
  );
}
export default Keyframes;
