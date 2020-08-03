
import { Subject } from 'rxjs/Subject';
import { Modal } from 'antd';
import { formatMessage } from '../localizations/intl';

const myObservable = new Subject();

const isAbsoluteURL = url => /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url) || /^\//.test(url);
const combineURL = (baseURL, relativeURL) => relativeURL
    ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
    : baseURL;
const getAbsoluteURL = (basePath, url) => {
    if (url)
        return isAbsoluteURL(url) ? url : combineURL(basePath, url);
    return undefined;
};
let _cache = null;

export const getGlobalConfig = async () => {
    if (_cache)
        return _cache;
    const basePath = fetch.basePath || '';
    const response = await fetch(`${basePath}/static/config.json`, {
        headers: {
            'cache-control': 'no-cache'
        }
    });
    if (response.ok) {
        const {loginUrl, logoutUrl, resetPasswordUrl, ...data} = await response.json();
        _cache = Object.freeze({
            loginUrl: getAbsoluteURL(basePath, loginUrl),
            logoutUrl: getAbsoluteURL(basePath, logoutUrl),
            resetPasswordUrl: getAbsoluteURL(basePath, resetPasswordUrl),
            ...data
        })
        return _cache;
    }
    else
        return null;
}

myObservable.subscribe(async (value) => {
    const cache = await getGlobalConfig();
    if (value.type === '@trigger/authenticate') {
        const tipModal = Modal.info({
            title: formatMessage({
                id: 'COMMON_REQUEST_401_TIP_MESSAGE',
                defaultMessage: '由于您长时间未操作，系统出于安全考虑，已为您退出登录'
            }),
            onOk() {
                if (cache && cache.loginUrl)
                    window.location.href = `${cache.loginUrl}?redirect_uri=${encodeURIComponent(window.location.href)}`;
                else
                    console.warn("please set loginUrl to handle unauthorized http request");
                tipModal.update({
                    okText: 'loading...'
                })
                return Promise.reject();
            }
        })
        return;
    }
    if (value.type === '@trigger/signOut') {
        window.location.href = cache.logoutUrl;
    }
    if (value.type === '@trigger/resetPassword') {
        window.location.href = cache.resetPasswordUrl;
    }
});

export const handleAuthenticate = () => {
    myObservable.next({
        type: '@trigger/authenticate'
    });
}

const handleSignOut = () => {
    myObservable.next({
        type: '@trigger/signOut'
    });
}

const handleResetPassword = () => {
    myObservable.next({
        type: '@trigger/resetPassword'
    });
}
export const isSignOutHandler = async () => {
    const cache = await getGlobalConfig();
    console.log(cache);
    if (cache && cache.logoutUrl) {
        handleSignOut();
        return true;
    }
    else
        return false;
}

export const isResetPasswordHandler = async () => {
    const cache = await getGlobalConfig();
    if (cache && cache.resetPasswordUrl) {
        handleResetPassword();
        return true;
    }
    else
        return false;
}