import * as actions from '../shell';
test('常量', () => {
    expect(actions.SHELL_SET_BUSY).toBe('SHELL_SET_BUSY');
    expect(actions.CHANGE_LANGUAGE).toBe('CHANGE_LANGUAGE');
    expect(actions.SHELL_SET_SIDEBAR).toBe('SHELL_SET_SIDEBAR');
    expect(actions.SHELL_INIT_BEGIN).toBe('SHELL_INIT_BEGIN');
    expect(actions.SHELL_INIT_SUCCESS).toBe('SHELL_INIT_SUCCESS');
    expect(actions.SHELL_INIT_FAILED).toBe('SHELL_INIT_FAILED');
    expect(actions.SHELL_ADD_RECENT).toBe('SHELL_ADD_RECENT');
    expect(actions.SHELL_SET_CHANGED).toBe('SHELL_SET_CHANGED');
    expect(actions.SHELL_SET_MENUPATH).toBe('SHELL_SET_MENUPATH');    
});
test('actionCreate', () => {
    const name = 'name';    
    const isBusy = 'isBusy';
    const language = 'language';
    const options = 'options';
    const result = 'result';
    const err = 'err';
    const item = 'item';
    const message = 'message';
    const menuPath = 'menuPath';
    expect(actions.shellSetBusy(name, isBusy)).toEqual({
        type: actions.SHELL_SET_BUSY,
        payload: {
            name,
            isBusy
        }
    });
    expect(actions.changeLanguage(language)).toEqual({
        type: actions.CHANGE_LANGUAGE,
        payload: language
    });
    expect(actions.shellSetSidebar(options)).toEqual({
        type: actions.SHELL_SET_SIDEBAR,
        payload: options
    });
    expect(actions.shellInitBegin()).toEqual({
        type: actions.SHELL_INIT_BEGIN
    });
    expect(actions.shellInitSuccess(result)).toEqual({
        type: actions.SHELL_INIT_SUCCESS,
        payload: result
    });
    expect(actions.shellInitFailed(err)).toEqual({
        type: actions.SHELL_INIT_FAILED,
        payload: err
    });
    expect(actions.shellAddRecent(item)).toEqual({
        type: actions.SHELL_ADD_RECENT,
        payload: item
    });
    expect(actions.shellSetChanged(message)).toEqual({
        type: actions.SHELL_SET_CHANGED,
        payload: message
    });
    expect(actions.shellSetMenuPath(menuPath)).toEqual({
        type: actions.SHELL_SET_MENUPATH,
        payload: menuPath
    });
});