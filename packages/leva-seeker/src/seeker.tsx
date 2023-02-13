import React, { useMemo } from "react";
import { useInputContext, useInputSetters, Components } from "leva/plugin";
import { SeekerProps } from "./seeker-types";

const { Label, Row, Vector, Select } = Components;

export function SeekerComponent() {
  const { label, value, displayValue, settings, onUpdate, setSettings } = useInputContext<SeekerProps>();
  const { graph, preview } = settings;

  return (
    <>
      <Row input>
        <Label>{label}</Label>
      </Row>
      {graph && <Row></Row>}
    </>
  );
}
