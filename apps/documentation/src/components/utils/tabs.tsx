import { FC, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { tabMap } from "./stores";

type Panels = Record<string, `panel.${string}`>;

const ReusableTabs: FC<{ tabs: string[]; sharedId: string } & Panels> = ({
  tabs,
  sharedId,
  ...slots
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (sharedId) {
      tabMap.subscribe((v, k) => {
        if (k === sharedId) setIndex(v[k]);
      });
    }
  }, [sharedId]);

  const handleChange = (i: number) => {
    setIndex(i);
    if (sharedId) tabMap.setKey(sharedId, i);
  };

  return (
    <Tab.Group selectedIndex={index} onChange={handleChange}>
      <Tab.List
        className={
          "border-b-2 border-slate-300 dark:border-slate-600  space-x-2"
        }
      >
        {tabs.map((t) => (
          <Tab
            className={
              "ui-selected:!bg-slate-300 dark:ui-selected:!bg-slate-600 hover:bg-slate-200 hover:dark:bg-slate-800 rounded-t-lg !outline-none px-4 px-4"
            }
            key={t}
          >
            {t}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {tabs.map((t) => (
          <Tab.Panel key={`${t}-panel`}>{slots["panel." + t]}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};
export default ReusableTabs;
