import BootstrapperBase from './base';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from '@shsdt/web-shared/lib/utils/connectExtended';
import createStore from './createStore';
import Immutable from 'immutable';
import {combineReducers} from 'redux-immutable';

const emptyReducer = (state = Immutable.Map()) => state;

class BootstrapperProd extends BootstrapperBase {
    constructor(config) {
        super(config);
        this.config = config;
    }

    run() {
        super.initManager(this.config.options);
        /* eslint-disable no-undef */
        const basePath = '.';
        /* eslint-enable */
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
        ReactDOM.render(
            <Provider store={store}>
                <Shell
                    routerData={pageData}
                    topMenu={topMenus}
                    getLocalization={pageData.getLocalization}/>
            </Provider>,
            document.getElementById(options.root || 'shell')
        );
    }
}

export default BootstrapperProd;
