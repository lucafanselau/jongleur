import { FC, ReactNode } from "react";
import { Disclosure, Transition } from "@headlessui/react";

export const Collapsible: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div
      className={
        "w-full prose-pre:m-0 rounded-lg bg-slate-200 dark:bg-slate-600 border border-slate-600 dark:border-slate-400"
      }
    >
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between items-center rounded-lg p-3 text-bold ">
              <span className="font-semibold text-lg">{title}</span>
              {open ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </Disclosure.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-y-85 opacity-0"
              enterTo="transform scale-y-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-y-100 opacity-100"
              leaveTo="transform scale-y-85 opacity-0"
            >
              <Disclosure.Panel>
                <div className="h-[1px] bg-slate-600 dark:bg-slate-400" />
                <div className="p-3">{children}</div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
