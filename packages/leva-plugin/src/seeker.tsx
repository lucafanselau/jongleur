import React, { useCallback, useMemo, useRef } from "react";
import { useInputContext, useInputSetters, Components } from "leva/plugin";
import { SeekerProps } from "./seeker-types";

const { Label, Row, Vector, Select, Number } = Components;

const valueKey = "current";
export function SeekerComponent() {
  const { label, value, displayValue, settings, onUpdate, setSettings } = useInputContext<SeekerProps>();
  // TODO make this better

  const valueRef = useRef(value[valueKey]);
  valueRef.current = value[valueKey];

  const setValue = useCallback(
    (newValue: any) => {
      const value = valueRef.current;
      const _newValue = typeof newValue === "function" ? newValue(value) : newValue;
      onUpdate({ ["current"]: _newValue });
    },
    [onUpdate, settings]
  );

  const number = useInputSetters({ type: "NUMBER", value: value.current, settings, setValue });

  const { graph, preview } = settings;

  return (
    <>
      <Row input>
        <Label>{label}</Label>
        <Number
          id={"current"}
          label={valueKey as string}
          value={value[valueKey]}
          displayValue={value[valueKey]}
          onUpdate={number.onUpdate}
          onChange={number.onChange}
          settings={{ min: 0, max: 1, step: 0.01, pad: 0.01, initialValue: valueRef.current }}
          // innerLabelTrim={innerLabelTrim}
        />
      </Row>
      {graph && <Row></Row>}
    </>
  );
}
