/* eslint-disable */
const getWebpackVendorsTest = require('./getWebpackVendorsTest');

describe('getWebpackVendorsTest', () => {
    const webpackVendorsTest = getWebpackVendorsTest({
        shell: '@shsdt/web-shell',
        dependencies: [
            '@chery/web-client'
        ]
    });
    test('shell is not vendor module', () => {
        expect(webpackVendorsTest({
            context: 'D:\\DMS\\web-main\\node_modules\\@shsdt\\web-shell\\index.js'
        })).toBe(false);
    });
    test('dependencies is not vendor module', () => {
        expect(webpackVendorsTest({
            context: 'D:\\DMS\\web-main\\node_modules\\@chery\\web-client\\index.js'
        })).toBe(false);
    });
    test('antd is vendor module', () => {
        expect(webpackVendorsTest({
            context: 'D:\\DMS\\web-main\\node_modules\\antd\\index.js'
        })).toBe(true);
    });
});
