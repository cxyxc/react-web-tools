import Immutable from 'immutable';
import React from 'react';
import {notification, message as componentMessage, Modal} from 'antd';
import {formatMessage} from '../localizations/intl';

// 消息通知类型
export const NOTIFICATION_TYPE = Object.freeze({
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
});

// 消息通知展示类型
export const NOTIFICATION_MODE = Object.freeze({
    message: 'message',
    modal: 'modal',
    notification: 'notification'
});

export const SERVER_NOTIFICATION = 'SERVER_NOTIFICATION';
export const NOTIFICATION_TYPE_NAME = 'notificationType';
export const NOTIFICATION_MODE_NAME = 'notificationMode';
export const STATUS_CODE_NAME = 'statusCode';

const newNotification = (statusCode, notificationMode, message, notificationType) => ({
    [STATUS_CODE_NAME]: statusCode,
    message: message || (statusCode >= 200 && statusCode < 300
        ? formatMessage({
            id: 'COMMON_SERVERNOTIFICATION_SUCCESS',
            defaultMessage: '成功'
        })
        : formatMessage({
            id: 'COMMON_SERVERNOTIFICATION_FAIL',
            defaultMessage: '服务器异常，请联系管理员'
        })
    ),
    [NOTIFICATION_TYPE_NAME]: notificationType && Object.values(NOTIFICATION_TYPE).indexOf(notificationType) > -1
        ? notificationType
        : (statusCode >= 200 && statusCode < 300 ? NOTIFICATION_TYPE.success : NOTIFICATION_TYPE.error),
    [NOTIFICATION_MODE_NAME]: notificationMode && Object.values(NOTIFICATION_MODE).indexOf(notificationMode) > -1
        ? notificationMode
        : NOTIFICATION_MODE.notification,
    timestamp: Date.now().toString()
});

/**
 * 生成消息通知 action
 * @param other：业务参数，default：{type: SERVER_NOTIFICATION}
 * @param statusCode：http statusCode
 * @param notificationMode：消息展示方式，选项：NOTIFICATION_MODE
 * @param message：消息内容，default: other.message
 * @param notificationType：消息类型，选项：NOTIFICATION_TYPE
 * @returns {
 *     ...other,
 *     notification: {
 *         statusCode,
 *         notificationMode,
 *         notificationType,
 *         message,
 *         timestamp
 *     }
 * }
 */
export const notificationCreator = (other = {type: SERVER_NOTIFICATION}, statusCode, notificationMode, message, notificationType) => {
    if(statusCode)
        return Object.assign(other, {notification: newNotification(statusCode, notificationMode, message || other.message, notificationType)});
    console.warn('statusCode is null or undefined');
    return other;
};

/**
 * 创建用于生成消息通知的方法
 * @param actionCreator(...other)
 * @returns actionCreator(...other, statusCode, notificationMode, message, notificationType)，方法参数参见 notificationCreator
 */
export const createNotificationAction = actionCreator => {
    function createAction() {
        const argsLength = actionCreator ? actionCreator.length : 0;
        const statusCode = arguments[argsLength];
        const notificationMode = arguments[argsLength + 1];
        const message = arguments[argsLength + 2];
        const notificationType = arguments[argsLength + 3];
        const action = actionCreator ? actionCreator(...arguments) : {type: SERVER_NOTIFICATION};
        if(statusCode)
            action.notification = newNotification(statusCode, notificationMode, message || action.message, notificationType);
        else
            console.warn('statusCode is null or undefined');
        return action;
    }
    return createAction;
};

export const createNotificationReducer = (state = Immutable.Map(), action) => {
    const data = action.notification;
    if(data && data[STATUS_CODE_NAME] && data[NOTIFICATION_TYPE_NAME])
        return state.merge({
            statusCode: data[STATUS_CODE_NAME],
            message: data.message,
            type: data[NOTIFICATION_TYPE_NAME],
            mode: data[NOTIFICATION_MODE_NAME],
            timestamp: data.timestamp
        });
    

    return state;
};

const formatContent = content => {
    if(!content)
        return;
    if(Array.isArray(content))
        return content.map((item, index) => <p key={index}>{item}</p>);
    const tmp = content.split('\n');
    if(tmp.length === 1)
        return content;
    return tmp.map((item, index) => <p key={index}>{item}</p>);
};

export const createNotification = (nextNotification, thisNotification) => {
    if(thisNotification && thisNotification.timestamp === nextNotification.timestamp)
        return;
    if(!nextNotification.message)
        return;

    const type = nextNotification.type || NOTIFICATION_TYPE.error;
    const title = nextNotification.message.title || nextNotification.message;
    const content = formatContent(nextNotification.message.content);

    switch(nextNotification.mode) {
        case NOTIFICATION_MODE.modal:
            return Modal[type]({title,
                content});
        case NOTIFICATION_MODE.notification:
            return notification[type]({message: title,
                description: content});
        default:
            return componentMessage[type](content ? (Array.isArray(content) ? [title, ...content] : `${title}：${content}`) : title);
    }
};
