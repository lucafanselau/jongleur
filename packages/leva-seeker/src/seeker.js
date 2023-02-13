import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useInputContext, Components } from "leva/plugin";
const { Label, Row, Vector, Select } = Components;
export function SeekerComponent() {
    const { label, value, displayValue, settings, onUpdate, setSettings } = useInputContext();
    const { graph, preview } = settings;
    return (_jsxs(_Fragment, { children: [_jsx(Row, { input: true, children: _jsx(Label, { children: label }) }), graph && _jsx(Row, {})] }));
}
