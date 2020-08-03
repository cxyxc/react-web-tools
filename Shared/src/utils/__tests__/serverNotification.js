import * as server from '../serverNotification';
import React from 'react';
const Immutable = require('immutable');
import { notification, message as componentMessage, Modal } from 'antd';
notification.success = jest.fn(() => 'notification');
Modal.error = jest.fn(() => 'modal');
componentMessage.success = jest.fn(() => 'message');
Date.now = jest.fn(() => 1482363367071);
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({
    adapter: new Adapter(),
});
const {render, shallow, mount } = Enzyme;
describe('serverNotification', () => {
    describe('常量', () => {
        test('NOTIFICATION_TYPE', () => {
            expect(server.NOTIFICATION_TYPE).toEqual({
                success: 'success',
                info: 'info',
                warning: 'warning',
                error: 'error'
            })
        });
        test('NOTIFICATION_TYPE', () => {
            expect(server.NOTIFICATION_MODE).toEqual({
                message: 'message',
                modal: 'modal',
                notification: 'notification'
            })
        });
        test('other constants', () => {
            expect(server.SERVER_NOTIFICATION).toBe('SERVER_NOTIFICATION');
            expect(server.NOTIFICATION_TYPE_NAME).toBe('notificationType');
            expect(server.NOTIFICATION_MODE_NAME).toBe('notificationMode');
            expect(server.STATUS_CODE_NAME).toBe('statusCode');
        });
    });
    describe('func createNotification', () => {
        const statusCode = 200;
        const message = '提示信息';
        const type = 'success';
        const mode = 'notification';
        const props = {
            statusCode,
            mode,
            message,
            type,
            timestamp: '1482363367071'
        };
        const noMsgProps = {
            ...props,
            message: '',
            timestamp: '1482363367070'
        };
        test('测试 nextNotification 中 message 为空和 thisNotification && thisNotification.timestamp === nextNotification.timestamp时 返回undefined', () => {
            expect(server.createNotification(props, props)).toBeUndefined();
            expect(server.createNotification(noMsgProps, '')).toBeUndefined();
        });
        test('测试是否调用 notification 的方法', () => {
            const comp = server.createNotification(props, noMsgProps);
            expect(notification.success).toBeCalled();
            expect(comp).toEqual('notification');
        });
        test('测试是否调用 modal 的方法', () => {
            const newProps = { ...props, mode: 'modal', type: ''};
            const comp = server.createNotification(newProps, noMsgProps);
            expect(Modal.error).toBeCalled();
            expect(comp).toEqual('modal');
        });
        test('测试是否调用 message 的方法', () => {
            const newProps = {
                ...props,
                mode: 'message',
                message: {
                    title: 'message',
                    content: ''
                }
            };
            const comp = server.createNotification(newProps, noMsgProps);
            expect(componentMessage.success).toBeCalledWith('message');
            expect(comp).toEqual('message');
        });
        test('测试是否调用 message 的方法', () => {
            const newProps = {
                ...props,
                mode: 'message',
                message: {
                    title: 'message',
                    content: 'content'
                }
            };
            const comp = server.createNotification(newProps, noMsgProps);
            expect(componentMessage.success).toBeCalledWith('message：content');
            expect(comp).toEqual('message');
        });
    });
    describe('func createNotificationReducer', () => {
        const state = Immutable.fromJS({});
        test('测试 action中notification的statusCode、notificationMode、notificationType均不为空时 分发action的结果', () => {
            const action = {
                notification: {
                    statusCode: 200,
                    notificationMode: 'modal',
                    message: '提示信息',
                    notificationType: 'success',
                    timestamp: '1482363367071'
                },
            };
            const result = server.createNotificationReducer(state, action);
            expect(result.toJS()).toEqual({
                statusCode: 200,
                mode: 'modal',
                message: '提示信息',
                type: 'success',
                timestamp: '1482363367071'
            })
        });
        describe('测试 action中notification的statusCode、notificationType至少一个为空或notification为空时 分发action的结果', () => {
            const notification =  {
                statusCode: 200,
                notificationMode: 'modal',
                message: '提示信息',
                notificationType: 'success',
                timestamp: '1482363367071'
            };
            test('statusCode 为空时 state为{}', () => {
                const result = server.createNotificationReducer(state, {
                    notification: {
                        ...notification,
                        statusCode: ''
                    }
                });
                expect(result.toJS()).toEqual({})
            });
            test('notification 为空时 state为{}', () => {
                const result = server.createNotificationReducer(...[, {
                    notification: {}
                }]);
                expect(result.toJS()).toEqual({})
            });
            test('notificationType 为空时 state为{}', () => {
                const result = server.createNotificationReducer(state, {
                    notification: {
                        ...notification,
                        notificationType: ''
                    }
                });
                expect(result.toJS()).toEqual({})
            });
        });
    });
    describe('func createNotificationAction', () => {
        const state = Immutable.fromJS({});
        test('测试 createNotificationAction 返回的是函数', () => {
            const actionCreator = () => {};
            const result = server.createNotificationAction(actionCreator);
            expect(typeof result).toBe('function');
            expect(result.name).toBe('createAction');
        });
        test('测试 actionCreator 存在时 createAction 的返回值', () => {
            const actionCreator = message => ({
                type: 'GET_INIT_FAIL',
                message,
            });
            const result = server.createNotificationAction(actionCreator);            
            expect(result('提示消息', 200, 'messgae')).toEqual({
                type: 'GET_INIT_FAIL',
                message: '提示消息',
                notification:
                {
                    statusCode: 200,
                    message: '提示消息',
                    notificationType: 'success',
                    notificationMode: 'notification',
                    timestamp: '1482363367071'
                }
            });
        });
        test('测试 actionCreator 不存在时 createAction 的返回值', () => {
            const result = server.createNotificationAction();
            expect(result()).toEqual({
                type: server.SERVER_NOTIFICATION
            });
        });
    });
    describe('func notificationCreator', () => {
        test('参数statusCode不存在时， 返回other', () => {
            const result = server.notificationCreator()
            expect(result).toEqual({type: server.SERVER_NOTIFICATION})
        });
        test('参数statusCode 存在时， 返回other', () => {
            const other = { type: server.SERVER_NOTIFICATION };
            const statusCode = 200;
            const notificationMode = 'modal';
            const notificationType = 'success';
            const { notification } = server.notificationCreator(...[other, statusCode, notificationMode, , notificationType])
            expect(notification).toEqual({
                statusCode,
                notificationMode,
                message: '成功',
                notificationType,
                timestamp: '1482363367071'
            });
        });
        test('func newNotification statusCode === 400', () => {
            const other = { type: server.SERVER_NOTIFICATION };
            const { notification } = server.notificationCreator(other, 400);
            expect(notification).toEqual({statusCode: 400,
                message: '服务器异常，请联系管理员',
                notificationType: 'error',
                notificationMode: 'notification',
                timestamp: '1482363367071'
            });
        })
    })
});