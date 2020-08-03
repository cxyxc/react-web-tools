import mergeWith from 'lodash/mergeWith';
import isObject from 'lodash/isObject';

const isAbsoluteURL = url => /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);

const combineURL = (baseURL, relativeURL) => relativeURL
    ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
    : baseURL;

const deepMerge = (object, source) => mergeWith({}, object, source, (objValue, srcValue) => {
    if (isObject(objValue) && srcValue)
        return deepMerge(objValue, srcValue);
});

// 获取全局变量
let local = null;

if (typeof global !== 'undefined')
    local = global;
else if (typeof self !== 'undefined') // eslint-disable-line no-negated-condition
    local = self;
else
    try {
        local = Function('return this')(); // eslint-disable-line no-new-func
    } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
    }

const originalFetch = local.fetch;

class FetchPolyfill {
    constructor() {
        // baseURL cookie等的配置
        this.baseURL = '';
        this.options = {};
        this.responseInterceptor = undefined;
        this.preRequest = Promise.resolve();
        this.fetch = this.fetch.bind(this);
        this.polyfill = this.polyfill.bind(this);
    }

    fetch(url, options) {
        // 处理url
        if (this.baseURL && !isAbsoluteURL(url))
            url = combineURL(this.baseURL, url);

        return this.preRequest.then(() => originalFetch(url, deepMerge(this.options, options)).then(res => {
            if (this.responseInterceptor)
                return this.responseInterceptor(res);
            return res;
        }));
    }

    setOptions(options) {
        if (!options)
            return;
        this.options = deepMerge(this.options, options);
    }

    /**
     * baseURL 设置子目录
     * options 设置发送fetch请求时的默认设置
     */
    polyfill(baseURL, options = {}, responseInterceptor, preRequest) {
        this.baseURL = baseURL;
        this.options = options;
        this.responseInterceptor = responseInterceptor;
        if(preRequest) {
            const result = preRequest();
            if(result.then && typeof result.then === 'function')
                this.preRequest = result.catch(error => console.error('preRequest failed: ', error));
        }
    }
}

const fetchPolyfill = new FetchPolyfill();

local.fetch = fetchPolyfill.fetch;

export default fetchPolyfill;
