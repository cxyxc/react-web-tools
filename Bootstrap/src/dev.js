import BootstrapperBase from './base';
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {Provider} from '@shsdt/web-shared/lib/utils/connectExtended';
import createStore from './createStore';
import Immutable from 'immutable';
import {combineReducers} from 'redux-immutable';

const emptyReducer = (state = Immutable.Map()) => state;

class BootstrapperDev extends BootstrapperBase {
    run() {
        super.initManager(this.options);
        const basePath = '';
        // 初始化 fetch
        super.initFetch(basePath);
        this.initReact();
    }
    
    // ReactDOM.render
    initReact() {
        const topMenus = super.getTopMenus();
        const {shellData, pageData, options} = this;
        const Shell = shellData.component;
        const store = createStore({
            reducers: combineReducers({
                shell: shellData.reducer || emptyReducer
            }),
            initialState: {
                shell: shellData.state
            },
            createOpts: {
                epics: shellData.epic
            }
        });
        const render = () => {
            ReactDOM.render(
                <AppContainer>
                    <Provider store={store}>
                        <Shell
                            routerData={pageData}
                            topMenu={topMenus}
                            getLocalization={pageData.getLocalization}/>
                    </Provider>
                </AppContainer>,
                document.getElementById(options.root || 'shell')
            );
        };
        render();
        if(module.hot)
            module.hot.accept(options.hotAccept, render);
    }
}

export default BootstrapperDev;
