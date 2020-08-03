import Immutable from 'immutable';
import {combineReducers} from 'redux-immutable';
import {
    SHELL_INIT_BEGIN, SHELL_SET_BUSY, SHELL_SET_ACTIONS, SHELL_SET_BREADCRUMB,
    SHELL_SET_SIDEBAR, SHELL_INIT_FAILED, SHELL_INIT_SUCCESS, SHELL_ADD_RECENT, SHELL_SET_CHANGED,
    SHELL_SET_MENUPATH, SHELL_SET_MENUSYSTEM_POSITION
} from '@shsdt/web-shared/lib/actions/shell';

const busyRegistry = {};

const ui = (state = Immutable.Map(), action) => {
    let recents = null;
    let index = null;

    switch(action.type) {
        case SHELL_INIT_BEGIN:
            return state.set('isBusy', true);
        case SHELL_SET_BUSY:
            if(action.payload.isBusy)
                busyRegistry[action.payload.name] = true;
            else
                delete busyRegistry[action.payload.name];
            return state.set('isBusy', Object.keys(busyRegistry).length > 0);
        case SHELL_SET_ACTIONS:
            return state.set('actions', Immutable.fromJS(action.payload));
        case SHELL_SET_BREADCRUMB:
            return state.set('breadcrumb', Immutable.fromJS(action.payload));
        case SHELL_SET_SIDEBAR:
            if(action.payload && action.payload.isExpanded !== undefined) {
                localStorage.setItem('isSidebarExpanded', action.payload.isExpanded === true);
                state = state.set('isSidebarExpanded', action.payload.isExpanded === true);
            }
            return state;
        case SHELL_INIT_SUCCESS:
            if(action.payload.menus)
                state = state.set('menus', Immutable.fromJS(action.payload.menus));
            state = state.set('isBusy', false);
            return state;
        case SHELL_INIT_FAILED:
            state = state.set('isBusy', false);
            return state;
        case SHELL_ADD_RECENT:
            recents = (state.get('recents') || Immutable.List());
            index = recents.findIndex(item => item.get('title') === action.payload.title);
            if(index > -1)
                recents = recents.delete(index);
            recents = recents.push(Immutable.fromJS(action.payload));
            recents = recents.size > 10 ? recents.take(10) : recents;
            localStorage.setItem('recents', JSON.stringify(recents.toJS()));
            return state.set('recents', recents).set('currentMenu', Immutable.fromJS(action.payload));
        case SHELL_SET_CHANGED:
            return state.set('changed', action.payload);
        case SHELL_SET_MENUPATH:
            return state.set('menuPath', Immutable.fromJS(action.payload));
        case SHELL_SET_MENUSYSTEM_POSITION:
            localStorage.setItem('menuSystemPosition', action.payload.position);
            return state.set('menuSystemPosition', action.payload.position);
    }

    return state;
};

const config = (state = Immutable.Map(), action) => {
    if(action.type === 'SHELL_SET_CONFIG')
        state = Immutable.fromJS(action.payload);
    return state;
};

export default (combineReducers({
    ui,
    config
}));
