const defaultSettings = { graph: true, preview: true };
export const normalize = (input) => {
    return { value: input, settings: {} };
};
export const sanitize = (value, settings, prevValue) => {
    return value;
};
