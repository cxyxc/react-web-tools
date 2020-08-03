import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {createEpicMiddleware, combineEpics} from 'redux-observable';
import window from 'global';
import Immutable from 'immutable';

export default function({
    reducers,
    initialState,
    createOpts: {epics},
}) {
    const middlewares = [
        thunk,
    ];
    if(epics)
        middlewares.push(createEpicMiddleware(combineEpics(epics)));

    let devtools = () => noop => noop;
    /* eslint-disable no-underscore-dangle */
    if(
        process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION__
    )
        devtools = window.__REDUX_DEVTOOLS_EXTENSION__;
  

    const enhancers = [
        applyMiddleware(...middlewares),
        devtools(window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS),
    ];

    return createStore(reducers, Immutable.fromJS(initialState), compose(...enhancers));
}
