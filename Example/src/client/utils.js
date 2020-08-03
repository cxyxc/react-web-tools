import {formatMessage, formatNumber, language} from './common/localize';
import {AMOUNT_FORMAT, PERCENT_FORMAT} from './constants';
import moment from 'moment';
import {superstruct} from 'superstruct';
import {message, Modal} from 'antd';

/**
 * 根据value获取指定枚举值对应的文本
 * @param {Object} enumData 枚举对象
 * @param {number} value 枚举值
 */
export const conventEnumValueToString = (enumData, value) => {
    if(typeof value === 'undefined' || value === null)
        return null;
    return enumData.has(value) && enumData.properties[value].getText(language);
};

/**
 * 日期时间校验
 */
export const customeStruct = superstruct({
    types: {
        datetime: value => moment(value).isValid()
    }
});

/**
 * 格式化日期
 * @param {string} value
 * @param {string} format
 */
export const formatDateTime = (value, format) => {
    if(value && moment(value).isValid())
        return moment(value).format(format);
    return null;
};

/**
 * 格式化金额
 * @param {number | string} value   需要格式化的值
 * @param fractionDigits            小数位，默认 2 位小数
 * @return {string}
 */
export const formatAmount = (value, fractionDigits) => {
    // 前端可能会因浮点数精度丢失造成显示不一致
    // 如 2032.765 丢失精度后 2032.7649999999999 -> 2032.76
    // 现通过先保留 4 位再保留 2 位的方式统一处理
    fractionDigits = fractionDigits === null || fractionDigits === undefined
        ? AMOUNT_FORMAT.minimumFractionDigits : fractionDigits;
    const newValue = typeof value === 'number' ? parseFloat(value.toFixed(fractionDigits + 2)) : value;
    return formatNumber(newValue, {
        ...AMOUNT_FORMAT,
        minimumFractionDigits: fractionDigits
    });
};

/**
 * 格式化百分比
 * @param {number | string} value   需要格式化的值
 * @param fractionDigits            小数位，默认 1 位小数
 * @return {string}
 */
export const formatPercent = (value, fractionDigits) => fractionDigits === null || fractionDigits === undefined
    ? formatNumber(value, PERCENT_FORMAT)
    : formatNumber(value, {
        ...PERCENT_FORMAT,
        minimumFractionDigits: fractionDigits
    });

/**
 * 消息格式化
 * @param status        http status
 * @param description   操作描述，eg. 提交销售订单 / 查询用户信息
 * @param message       服务端返回的，具体消息内容
 * @returns {title: string, content: string}    格式化后的消息
 */
export const messageFormat = (status, description, message) => {
    const desc = description || '';
    switch(status) {
        case 200:
        case 201:
            return {title: formatMessage({
                id: 'response.success',
                defaultMessage: '{desc}成功'
            }, {desc})};
        case 401:
            return {
                title: formatMessage({
                    id: 'response.401',
                    defaultMessage: '{desc}失败：登录超时，请重新登录 (401)'
                }, {desc})
            };
        case 403:
            return {
                title: formatMessage({
                    id: 'response.403',
                    defaultMessage: '{desc}失败：没有权限执行操作，请联系管理员 (403)'
                }, {desc})
            };
        case 404:
            return {
                title: message ? formatMessage({
                    id: 'response.404',
                    defaultMessage: '{desc}失败 (404)'
                }, {desc}) : formatMessage({
                    id: 'response.404.undefined',
                    defaultMessage: '{desc}失败：操作未定 (404)'
                }, {desc}),
                content: message
            };
        case 500:
            return {
                title: formatMessage({
                    id: 'response.500',
                    defaultMessage: '{desc}失败：内部服务器错误 (500)'
                }, {desc}),
                content: message
            };
        case 502:
            return {
                title: formatMessage({
                    id: 'response.502',
                    defaultMessage: '{desc}失败，请稍后重试 (502)'
                }, {desc})
            };
        case 'struct':
            return {
                title: formatMessage({
                    id: 'response.structError',
                    defaultMessage: '{desc}失败：数据结构错误'
                }, {desc}),
                content: message
            };
        default:
            return {
                title: formatMessage({
                    id: 'response.defaultError',
                    defaultMessage: '{desc}失败 ({status})'
                }, {
                    desc,
                    status
                }),
                content: message
            };
    }
};


/**
 * 成功/失败后的消息提示类型定义
 */
export const REQUEST_TYPE = {
    query: {
        success: null,
        failure: 'message'
    },
    initQuery: {
        success: null,
        failure: 'modal'
    },
    submit: {
        success: 'message',
        failure: 'modal'
    },

};

const initQueryDefaultInfo = Object.freeze({
    title: formatMessage({
        id: 'initQueryDefaultInfo.title',
        defaultMessage: '界面初始化'
    })
});

/**
 * 处理异步请求的成功或错误提示
 * @param {REQUEST_TYPE} requestType 异步请求类型 query | submit | initQuery
 * @param {String} description 操作描述 eg: 新增仓库扩展信息
 */
export const handleFetchResultNotification = (requestType = REQUEST_TYPE.query, description) => res => {
    if(requestType === REQUEST_TYPE.initQuery && !description)
        description = initQueryDefaultInfo.title;
    
    const errorInfo = messageFormat(res.status, description, res.message);
    const successInfo = messageFormat(res.status, description, res.message);
    
    // 当服务端返回的 message 反序列化为 object 时，序列化为字符串做展示
    // 考虑目前 message 出现 object，一般为代码实现错误，content 展示暂时不考虑优化，仅以stringify文本展示
    if(errorInfo.content && typeof errorInfo.content === 'object')
        errorInfo.content = JSON.stringify(errorInfo.content);

    if(res.ok && requestType.success)
        switch(requestType.success) {
            case 'message':
                message.success(successInfo.title);
                break;
            default:
                message.success(successInfo.title);
        }
    
    if(!res.ok && requestType.failure)
        switch(requestType.failure) {
            case 'message':
                message.error(errorInfo.content ? `${errorInfo.title}：${errorInfo.content}` : errorInfo.title);
                break;
            case 'modal':
                Modal.error({
                    title: errorInfo.title,
                    content: errorInfo.content
                });
                break;
            default:
                Modal.error({
                    title: errorInfo.title,
                    content: errorInfo.content
                });
        }
    return res;
};


/**
 * 封装fetch，简化异步请求的处理
 * @param {string} url
 * @param {object} options
 * @param successStruct 成功时api返回值得结构
 */
export const request = (url, options, successStruct) => fetch(url, options).then(res => {
    // 500
    if(!res.ok && res.status !== 400 && res.status !== 402 && res.status !== 404)
        return res.text().then(text => ({
            ok: false,
            status: res.status,
            message: text
        }));
    return res.text().then(text => {
        let data = null;
        try {
            data = JSON.parse(text);
        } catch(error) {
            if(res.ok)
                return {
                    ok: true,
                    status: res.status,
                    data: text,
                };
            return {
                ok: false,
                status: res.status,
                message: text || res.statusText
            };
        }
        if(res.ok) {
            if(successStruct) {
                const [error, result] = successStruct.validate(data);
                if(error)
                    return {
                        ok: false,
                        status: 'struct',
                        message: error.message
                    };
                return {
                    ok: true,
                    status: res.status,
                    message: result.message,
                    data: result.payload || {}
                };
            }
            return {
                ok: true,
                status: res.status,
                message: data.message,
                data: data.payload || {}
            };
        }
        return {
            ok: false,
            status: res.status,
            errorCode: data.errorCode,
            message: data.message,
            data: data.payload || {}
        };
    });
}).catch(error => ({
    ok: false,
    status: 'error',
    message: error.message
}));
