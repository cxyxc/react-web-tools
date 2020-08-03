export const RECORD = "@@RECORD";
export const CLEAR = "@@CLEAR";
export const RELOAD = "@@RELOAD";

export const record = () => ({
    type: RECORD
});

export const clear = () => ({
    type: CLEAR
});

export const reload = data => ({
    type: RELOAD,
    data
});