import fetchMock from 'fetch-mock'

describe('测试 fetchPolyfill', () => {
    describe('测试 fetchPolyfill', () => {
        afterEach(() => {
            fetchMock.reset()
            fetchMock.restore()
          })

        test('正确拼接了传递的baseURL和options', () => {
            //todo: 单元测试的时候 ReferenceError: Headers is not defined
            // const headers = new Headers();
            // headers.append('Accept', 'application/json');
            const options = {
                credentials: 'same-origin',
                // headers
            };
            const result = { userName: 'wangMei' };

            fetchMock.getOnce('*', result);
            // 添加对原始fetch的监听
            const fetchSpy = jest.spyOn(global, 'fetch');

            const baseURL = "/api/v1/version";
            require('../fetch-polyfill').default.polyfill(`/${baseURL}/`, options);
            const fetchPolyfill = fetch;

            return fetchPolyfill('/api/v1/userInfo').then(resp => {
                //判断原始的fetch接受到的参数是根据配置拼接后的参数
                expect(fetchSpy.mock.calls[0][0]).toEqual(`/${baseURL}/api/v1/userInfo`);
                expect(fetchSpy.mock.calls[0][1]).toEqual(options);
                return resp.json();
            }).then(data => {
                //测试返回值是否正确
                expect(data).toEqual(result);
            });
        });
    }
    );

})
describe('fetchPolyfill', () => {
    test('properties', () => {
        const fetchPolyfill = require('../fetch-polyfill').default;
        expect(fetchPolyfill).toHaveProperty('baseURL');
        expect(fetchPolyfill).toHaveProperty('options');
        expect(fetchPolyfill).toHaveProperty('responseInterceptor');
        expect(fetchPolyfill).toHaveProperty('fetch');
        expect(fetchPolyfill).toHaveProperty('polyfill');
    })
    test('setOptions', () => {
        const fetchPolyfill = require('../fetch-polyfill').default;
        expect(fetchPolyfill.setOptions()).toBeUndefined();
        const options = {credentials: 'same-origin'};
        fetchPolyfill.setOptions(options);
        expect(fetchPolyfill.options).toEqual(options);
    })
    test('polyfill', () => {
        const fetchPolyfill = require('../fetch-polyfill').default;
        const baseURL = '/baseURL';
        const options = {credentials: 'same-origin'};
        const responseInterceptor = item => item;
        fetchPolyfill.polyfill(baseURL, options, responseInterceptor);
        expect(fetchPolyfill.baseURL).toEqual(baseURL);
        expect(fetchPolyfill.options).toEqual(options);
        expect(fetchPolyfill.responseInterceptor).toEqual(responseInterceptor);
    })
})
