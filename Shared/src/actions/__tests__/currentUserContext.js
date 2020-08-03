import * as actions from '../currentUserContext';
import fetchMock from 'fetch-mock';
Date.now = jest.fn(() => 1482363367071);
describe('测试', () => {
    afterEach(() => {
        fetchMock.reset()
        fetchMock.restore()
    })
    test('测试 NOTIFICATION_TYPE', () => {
        expect(actions.NOTIFICATION_TYPE).toEqual({
            success: 'success',
            info: 'info',
            warning: 'warning',
            error: 'error'
        })
    });
    describe('测试 getCurrentUserPages', () => {
        test('测试常量', () => {
            expect(actions.GET_CURRENT_USER_PAGES_BEGIN).toBe('GET_CURRENT_USER_PAGES_BEGIN');
            expect(actions.GET_CURRENT_USER_PAGES_SUCCESS).toBe('GET_CURRENT_USER_PAGES_SUCCESS');
            expect(actions.GET_CURRENT_USER_PAGES_FAIL).toBe('GET_CURRENT_USER_PAGES_FAIL');
        });
        test('测试 actionCreate', () => {
            const data = {};
            const statusCode = 400;
            const message = 'message';
            expect(actions.getCurrentUserPagesBegin()).toEqual({
                type: actions.GET_CURRENT_USER_PAGES_BEGIN
            });
            expect(actions.getCurrentUserPagesSuccess(data)).toEqual({
                type: actions.GET_CURRENT_USER_PAGES_SUCCESS,
                data
            });
            expect(actions.getCurrentUserPagesFail(statusCode, message)).toEqual({
                type: actions.GET_CURRENT_USER_PAGES_FAIL,
                statusCode,
                message,
                notificationType: 'error',
                timeStamp: '1482363367071',
            });
        });
        describe('测试 Api', () => {
            test('成功', () => {
                const response = {
                    payload: {
                        id: '1001',
                        name: '张三'
                    }
                };
                fetchMock.getOnce('/api/v1/users/me/pages', {
                    body: response,
                    headers: { 'content-type': 'application/json' }
                })
               return actions.getCurrentUserPagesApi().then(res => expect(res).toEqual({
                    isOk: true,
                    data: response.payload
                }));
            });
            test('失败', () => {
                const response = {
                    status: 400,
                    statusText: 'Bad Request'
                };
                fetchMock.getOnce('/api/v1/users/me/pages', {
                    body: response,
                    status: 400,
                    headers: { 'content-type': 'application/json' }
                })
               return actions.getCurrentUserPagesApi().then(res => expect(res).toEqual({
                    isOk: false,
                    message: response.statusText,
                    statusCode: response.status,
                }));
            });
            test('报错', () => {
                fetchMock.getOnce('/api/v1/users/me/pages', {
                    status: 200,
                    body: () => {},
                    headers: { 'content-type': 'application/json' }
                })
               return actions.getCurrentUserPagesApi().catch(error => expect(error).toMatch('error'));
            });
        })
    });
    describe('测试 getCurrentUserPagePermissions', () => {
        test('测试常量', () => {
            expect(actions.GET_CURRENT_USER_PAGE_PERMISSIONS_BEGIN).toBe('GET_CURRENT_USER_PAGE_PERMISSIONS_BEGIN');
            expect(actions.GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS).toBe('GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS');
            expect(actions.GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL).toBe('GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL');
        });
        test('测试 actionCreate', () => {
            const data = {};
            const statusCode = 400;
            const message = 'message';
            const code = '';
            expect(actions.getCurrentUserPagePermissionsBegin(code)).toEqual({
                type: actions.GET_CURRENT_USER_PAGE_PERMISSIONS_BEGIN,
                code
            });
            expect(actions.getCurrentUserPagePermissionsSuccess(data, code)).toEqual({
                type: actions.GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS,
                data,
                code
            });
            expect(actions.getCurrentUserPagePermissionsFail(statusCode, message, code)).toEqual({
                type: actions.GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL,
                statusCode,
                message,
                code,
                notificationType: 'error',
                timeStamp: '1482363367071',
            });
        });
        describe('测试 Api', () => {
            const code = 'code';
            test('成功', () => {
                const response = {
                    payload: ['add', 'update']
                };
                fetchMock.getOnce('/api/v1/users/me/pages/code', {
                    body: response,
                    headers: { 'content-type': 'application/json' }
                })
               return actions.getCurrentUserPagePermissionsApi(code).then(res => expect(res).toEqual({
                    isOk: true,
                    data: response.payload
                }));
            });
            test('失败', () => {
                const response = {
                    status: 400,
                    statusText: 'Bad Request'
                };
                fetchMock.getOnce('/api/v1/users/me/pages/code', {
                    body: response,
                    status: 400,
                    headers: { 'content-type': 'application/json' }
                })
               return actions.getCurrentUserPagePermissionsApi(code).then(res => expect(res).toEqual({
                    isOk: false,
                    message: response.statusText,
                    statusCode: response.status,
                }));
            });
            test('报错', () => {
                fetchMock.getOnce('/api/v1/users/me/pages/code', {
                    status: 200,
                    body: () => {},
                    headers: { 'content-type': 'application/json' }
                })
               return actions.getCurrentUserPagePermissionsApi(code).catch(error => expect(error).toMatch('error'));
            });
        })
    });
    describe('测试 getCurrentUserInfo', () => {
        test('测试常量', () => {
            expect(actions.GET_CURRENT_USER_INFO_BEGIN).toBe('GET_CURRENT_USER_INFO_BEGIN');
            expect(actions.GET_CURRENT_USER_INFO_SUCCESS).toBe('GET_CURRENT_USER_INFO_SUCCESS');
            expect(actions.GET_CURRENT_USER_INFO_FAIL).toBe('GET_CURRENT_USER_INFO_FAIL');
        });
        test('测试 actionCreate', () => {
            const data = {};
            const statusCode = 400;
            const message = 'message';
            const code = '';
            expect(actions.getCurrentUserInfoBegin()).toEqual({
                type: actions.GET_CURRENT_USER_INFO_BEGIN
            });
            expect(actions.getCurrentUserInfoSuccess(data)).toEqual({
                type: actions.GET_CURRENT_USER_INFO_SUCCESS,
                data,
            });
            expect(actions.getCurrentUserInfoFail(statusCode, message)).toEqual({
                type: actions.GET_CURRENT_USER_INFO_FAIL,
                statusCode,
                message,
                notificationType: 'error',
                timeStamp: '1482363367071',
            });
        });
        describe('refresh', () => {
            describe('refresh === undefined', () => { 
                describe('测试 Api', () => {
                    test('成功', () => {
                        const response = {
                            payload: {
                                id: '1001',
                                name: '张三'
                            }
                        };
                        fetchMock.getOnce('/api/v1/users/me', {
                            body: response,
                            headers: { 'content-type': 'application/json' }
                        })
                       return actions.getCurrentUserInfo().then(res => {
                           expect(res).toEqual({
                               isOk: true,
                               data: response.payload
                           })
                       });
                    });
                    test('失败', () => {
                        const response = {
                            status: 400,
                            statusText: 'Bad Request'
                        };
                        fetchMock.getOnce('/api/v1/users/me', {
                            body: response,
                            status: 400,
                            headers: { 'content-type': 'application/json' }
                        })
                       return actions.getCurrentUserInfo().then(res => expect(res).toEqual({
                            isOk: false,
                            message: response.statusText,
                            statusCode: response.status,
                        }));
                    });
                    test('报错', () => {
                        fetchMock.getOnce('/api/v1/users/me', {
                            status: 200,
                            body: () => {},
                            headers: { 'content-type': 'application/json' }
                        })
                       return actions.getCurrentUserInfo().catch(error => expect(error).toMatch('error'));
                    });
                })
            });
            describe('refresh === true', () => {
                describe('测试 Api', () => {
                    test('成功', () => {
                        const response = {
                            payload: {
                                id: '1001',
                                name: '张三'
                            }
                        };
                        fetchMock.getOnce('/api/v1/users/me', {
                            body: response.payload,
                            headers: { 'content-type': 'application/json' }
                        })
                        return actions.getCurrentUserInfo(true).then(res => expect(res).toEqual({
                            isOk: true,
                            data: undefined
                        }));
                    });
                })
            });
            describe('refresh === false', () => {
                describe('测试 getCurrentUserInfoCache', () => {
                    afterEach(() => {
                        window.localStorage.removeItem('currentUserInfo')
                    })
                    test('成功', () => {
                        const data = JSON.stringify({
                            id: '1001',
                            name: '张三'
                        });
                        window.localStorage.setItem('currentUserInfo', data)
                        return actions.getCurrentUserInfo(false).then(res => expect(res).toEqual({
                            isOk: true,
                            data: JSON.parse(data)
                        }));
                    });
                    test('失败', () => {
                        return actions.getCurrentUserInfo(false).then(res => expect(res).toEqual({
                            isOk: false,
                            message: '获取失败'
                        }));
                    });
                })
            });
        })
    });
})