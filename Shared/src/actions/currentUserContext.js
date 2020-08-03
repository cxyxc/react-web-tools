import {formatMessage} from '../localizations/intl';
const baseUrl = '/api/v1';
// 消息通知类型
export const NOTIFICATION_TYPE = Object.freeze({
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
});

// 获取当前用户可访问的pages
export const GET_CURRENT_USER_PAGES_BEGIN = "GET_CURRENT_USER_PAGES_BEGIN";
export const GET_CURRENT_USER_PAGES_SUCCESS = "GET_CURRENT_USER_PAGES_SUCCESS";
export const GET_CURRENT_USER_PAGES_FAIL = "GET_CURRENT_USER_PAGES_FAIL";

export const getCurrentUserPagesBegin = () => ({
    type: GET_CURRENT_USER_PAGES_BEGIN
});

export const getCurrentUserPagesSuccess = data => ({
    type: GET_CURRENT_USER_PAGES_SUCCESS,
    data
});

export const getCurrentUserPagesFail = (statusCode, message) => ({
    type: GET_CURRENT_USER_PAGES_FAIL,
    statusCode,
    message,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
})

export const getCurrentUserPagesApi = () => {
    return fetch(`${baseUrl}/users/me/pages`).then(res => {
        if (res.ok)
            return res.json().then(data => {
                return {
                    isOk: true,
                    data: data.payload
                }
            })
        else
            return {
                isOk: false,
                statusCode: res.status,
                message: res.statusText
            }
    }).catch(error => {
        return {
            isOk: false,
            message: error.message
        }
    });
}

// 获取指定页面当前用户的权限

export const GET_CURRENT_USER_PAGE_PERMISSIONS_BEGIN = "GET_CURRENT_USER_PAGE_PERMISSIONS_BEGIN";
export const GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS = "GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS";
export const GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL = "GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL";

export const getCurrentUserPagePermissionsBegin = code => ({
    type: GET_CURRENT_USER_PAGE_PERMISSIONS_BEGIN,
    code
})

export const getCurrentUserPagePermissionsSuccess = (data, code) => ({
    type: GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS,
    data,
    code
})

export const getCurrentUserPagePermissionsFail = (statusCode, message, code) => ({
    type: GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL,
    statusCode,
    message,
    code,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
})

export const getCurrentUserPagePermissionsApi = pageCode => {
    return fetch(`${baseUrl}/users/me/pages/${pageCode}`).then(res => {
        if (res.ok)
            return res.json().then(data => {
                return {
                    isOk: true,
                    data: data.payload
                }
            })
        else
            return {
                isOk: false,
                statusCode: res.status,
                message: res.statusText
            }
    }).catch(error => {
        return {
            isOk: false,
            message: error.message
        }
    });
}

// 获取当前用户信息
export const GET_CURRENT_USER_INFO_BEGIN = 'GET_CURRENT_USER_INFO_BEGIN';
export const GET_CURRENT_USER_INFO_SUCCESS = 'GET_CURRENT_USER_INFO_SUCCESS';
export const GET_CURRENT_USER_INFO_FAIL = 'GET_CURRENT_USER_INFO_FAIL';

export const getCurrentUserInfoBegin = () => ({
    type: GET_CURRENT_USER_INFO_BEGIN
})

export const getCurrentUserInfoSuccess = data => ({
    type: GET_CURRENT_USER_INFO_SUCCESS,
    data
})

export const getCurrentUserInfoFail = (statusCode, message) => ({
    type: GET_CURRENT_USER_INFO_FAIL,
    statusCode,
    message,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
})

const getCurrentUserInfoCache = () => {
    const userInfo = window.localStorage.getItem('currentUserInfo')
    let result;
    if (userInfo)
        result = {
            isOk: true,
            data: JSON.parse(userInfo)
        }
    else
        result = {
            isOk: false,
            message: formatMessage({
                id: 'COMMON_CURRENTUSERCONTEXT_MESSAGE',
                defaultMessage: '获取失败'
            })
        }
    return Promise.resolve(result);
}

const getCurrentUserInfoApi = () => {
    return fetch(`${baseUrl}/users/me`).then(res => {
        if (res.ok)
            return res.json().then(data => {
                if (data.payload)
                    window.localStorage.setItem('currentUserInfo', JSON.stringify(data.payload))
                return {
                    isOk: true,
                    data: data.payload
                }
            })
        else
            return {
                isOk: false,
                statusCode: res.status,
                message: res.statusText
            }
    }).catch(error => {
        return {
            isOk: false,
            message: error.message
        }
    });
}

export const getCurrentUserInfo = (refresh) => {
    if (typeof refresh === 'undefined')
        return getCurrentUserInfoApi();
    return refresh ? getCurrentUserInfoApi() : getCurrentUserInfoCache();
}
