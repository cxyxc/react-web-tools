import {combineEpics} from 'redux-observable';
import isBoolean from 'lodash/isBoolean';
import {
    SHELL_INIT_BEGIN,
    SHELL_INIT_SUCCESS,
    CHANGE_LANGUAGE,
    shellInitSuccess,
    shellInitFailed,
    shellSetSidebar
} from '@shsdt/web-shared/lib/actions/shell';
import {getCurrentUserPagesApi} from '@shsdt/web-shared/lib/actions/currentUserContext';
const Rx = require('rxjs/Rx');
const Observable = Rx.Observable;

// 用于 languageChangeEpic 中，返回不做处理的 action，不返回会报错
const AFTER_CHANGE_LANGUAGE = 'AFTER_CHANGE_LANGUAGE';

/* eslint-disable */
const languageChangeEpic = action$ => action$.ofType(CHANGE_LANGUAGE).map(action => {
    localStorage.setItem('language', action.payload);
    localStorage.removeItem('recents');
}).map(() => {
    location.reload();
    return {type: AFTER_CHANGE_LANGUAGE}
});
const shellInitEpic = (action$, store) => action$
    .ofType(SHELL_INIT_BEGIN)
    .mergeMap(() => Observable.fromPromise(getCurrentUserPagesApi())
    )
    .map(result => {
        if(result.isOk) {
            const data = {};
            data.menus = result.data;
            // 添加 menuLevel 用于菜单筛选
            // key 用于避免 title 重复的问题
            const addMenuLevelAndKey = (items = []) => {
                items.forEach(item => {
                    item.level = item.level || 0;
                    item.key = item.key || item.title;
                    if(item.items && item.items.length > 0) {
                        item.items.forEach(nextItem => {
                            nextItem.level = item.level + 1;
                            nextItem.key = nextItem.url || `${item.title}-${nextItem.title}`;
                        });
                        addMenuLevelAndKey(item.items);
                    }
                });
                return items;
            };
            addMenuLevelAndKey(data.menus);

            return shellInitSuccess(data);
        }

        return shellInitFailed(result.message);
    });

// 监听 shellInitSuccess 完成后再改动 isSidebarExpanded
// 为了规避 antd Menu 的不正常显示方式
const storage = window.localStorage;
const shellSetSidebarEpic = action$ => action$
    .ofType(SHELL_INIT_SUCCESS)
    .takeWhile(() => storage.hasOwnProperty('isSidebarExpanded') && isBoolean(JSON.parse(storage.getItem('isSidebarExpanded'))))
    .map(() => shellSetSidebar({
        isExpanded: JSON.parse(storage.getItem('isSidebarExpanded'))
    }));

export default (combineEpics(
    languageChangeEpic,
    shellInitEpic,
    shellSetSidebarEpic,
));
