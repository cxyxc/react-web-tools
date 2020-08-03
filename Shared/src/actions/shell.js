import {createAction} from 'redux-actions';

export const SHELL_SET_BUSY = 'SHELL_SET_BUSY';
export const shellSetBusy = createAction(SHELL_SET_BUSY, (name, isBusy) => ({
    name,
    isBusy
}));

export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const changeLanguage = createAction(CHANGE_LANGUAGE, language => language);

export const SHELL_SET_SIDEBAR = 'SHELL_SET_SIDEBAR';
export const shellSetSidebar = createAction(SHELL_SET_SIDEBAR, options => options);

export const SHELL_INIT_BEGIN = 'SHELL_INIT_BEGIN';
export const shellInitBegin = createAction(SHELL_INIT_BEGIN);

export const SHELL_INIT_SUCCESS = 'SHELL_INIT_SUCCESS';
export const shellInitSuccess = createAction(SHELL_INIT_SUCCESS, result => result);

export const SHELL_INIT_FAILED = 'SHELL_INIT_FAILED';
export const shellInitFailed = createAction(SHELL_INIT_FAILED, err => err);

export const SHELL_ADD_RECENT = 'SHELL_ADD_RECENT';
export const shellAddRecent = createAction(SHELL_ADD_RECENT, item => item);

export const SHELL_SET_CHANGED = 'SHELL_SET_CHANGED';
export const shellSetChanged = createAction(SHELL_SET_CHANGED, message => message);

export const SHELL_SET_MENUPATH = 'SHELL_SET_MENUPATH';
export const shellSetMenuPath = createAction(SHELL_SET_MENUPATH, menuPath => menuPath);

export const SHELL_SET_MENUSYSTEM_POSITION = 'SHELL_SET_MENUSYSTEM_POSITION';
export const shellSetMenuSystemPosition = createAction(SHELL_SET_MENUSYSTEM_POSITION, position => position);
