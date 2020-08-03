import 'es6-promise/auto';
import 'isomorphic-fetch';
import 'raf/polyfill';
import React from 'react';
import fetchPolyfill from '@shsdt/web-shared/lib/utils/fetch-polyfill';
import cacheManager from '@shsdt/web-shared/lib/utils/cacheManager';
import {enumManager} from '@shsdt/web-shared/lib/utils/enumType';
import {getCurrentUserInfo} from '@shsdt/web-shared/lib/actions/currentUserContext';
import {handleAuthenticate} from '@shsdt/web-shared/lib/utils/externalAuthenticationManager';

class BootstrapperBase {
    constructor({shellData, pageData, topMenuData, options}) {
        this.shellData = shellData;
        this.pageData = pageData;
        this.topMenuData = topMenuData;
        this.options = options;
        this.initFetch = this.initFetch.bind(this);
        this.getTopMenus = this.getTopMenus.bind(this);
    }

    // 初始化 Manager
    initManager(config) {
        const run = (name, boolen, func) => {
            if(boolen)
                func();
            else
                console.warn(`failed to initialize ${name}`);
        };
        // 枚举原型初始化
        run('enumManager', config.languages && config.defaultLanguage, () => {
            enumManager.setLanguages(config.languages);
            enumManager.setDefaultLanguage(config.defaultLanguage);
        });
    }

    getTopMenus() {
        const {topMenuData} = this;
        const topMenus = [];
        topMenuData.forEach((menu, index) => {
            const Component = menu.component;
            const topMenuName = `subMenu${index + 1}`;
            topMenus.push(<Component key={index} name={topMenuName} />);
        });
        return topMenus;
    }

    // 初始化 fetch
    initFetch(basePath, preRequest) {
    // fetch 接到 401 后跳转至登录页面的逻辑
        const beforeResponse = res => {
            if(res.status === 401) {
                getCurrentUserInfo(false).then(result => {
                    let username = '';
                    if(result && result.data)
                        username = result.data.username;
                    if(username) {
                        const stateKey = `${username}-${window.location.href}`;
                        cacheManager.saveStateCache(stateKey);
                    }
                });
                handleAuthenticate();
            }
            return res;
        };

        const options = {
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json, application/vnd.api+json'
            }
        };

        // 在 IE 9-11 中发起 Ajax 请求得到响应后，如果再发起同样的请求，IE 会直接返回之前缓存的响应，而不是请求服务端。
        if(false || Boolean(document.documentMode))
            options.headers.Pragma = 'no-cache';
    
        fetchPolyfill.polyfill(basePath, options, beforeResponse, preRequest);
        fetch.basePath = basePath;
    }
}

export default BootstrapperBase;
