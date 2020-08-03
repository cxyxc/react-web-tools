import {createSelector} from 'reselect';
import {Map, List} from 'immutable';

export const selectorFactory = (path, defaultValue) => createSelector(
    state => {
        if(!Array.isArray(path))
            throw Error('Expected first argument to be an array');
        return state.getIn(path);
    },
    data => {
        if(data !== undefined)
            // TODO: v4-rc 支持 Immutable.isImmutable
            return Map.isMap(data) || List.isList(data) ? data.toJS() : data;
        return defaultValue;
    }
);

export const mulitSelectorFactory = (...paths) => {
    if(paths.length === 0)
        throw Error('Expected argument to be an array');
    if(paths.length === 1)
        return selectorFactory(paths[0]);
    const keys = [];
    const selects = paths.map(path => {
        const key = path[path.length - 1];
        if(keys.indexOf(key) !== -1)
            throw Error(`Duplicate name: ${key}\n the last part of path is duplicate as name of selector\n use structuredSelectorFactory instead`);
        keys.push(key);
        return selectorFactory(path);
    });
    return createSelector(
        selects,
        (...values) => values.reduce((composition, value, index) => {
            composition[keys[index]] = value;
            return composition;
        }, {})
    );
};

export const structuredSelectorFactory = paths => {
    if(typeof paths !== 'object')
        throw new Error('Expects argument to be an object');
    const keys = Object.keys(paths);
    return createSelector(
        keys.map(key => {
            const path = paths[key];
            return Array.isArray(path) ? selectorFactory(path) : selectorFactory(path.value, path.default);
        }),
        (...values) => values.reduce((composition, value, index) => {
            composition[keys[index]] = value;
            return composition;
        }, {})
    );
};

export default selectorFactory;
