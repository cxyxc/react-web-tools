import Immutable from 'immutable';
import { selectorFactory, mulitSelectorFactory, structuredSelectorFactory } from '../immutableToJsSelectorFactory';

describe('测试 immutableToJsSelectorFactory', () => {
    const detail = [{
        id: 1,
        code: 'c1'
    }, {
        id: 2,
        code: 'c2'
    }];
    let state = Immutable.fromJS({
        ui: {
            panel: {
                enable: false,
                title: 'title',
                empty: null,
                emptyStr: '',
                zero: 0
            }
        },
        data: {
            detail,
            order: {
                id: 1,
                code: 'order'
            }
        }
    });

    test('selectorFactory 应使用 array 作为 path', () => {
        const error = 'Expected first argument to be an array';
        expect(selectorFactory()).toThrow(error);
        expect(selectorFactory('ui')).toThrow(error);
    });

    test('selectorFactory 应返回正确的值', () => {
        expect(selectorFactory(['ui', 'panel', 'enable'])(state)).toBeFalsy();
        expect(selectorFactory(['ui', 'panel', 'title'])(state)).toBe('title');
        expect(selectorFactory(['ui', 'panel', 'emptyStr'])(state)).toBe('');
        expect(selectorFactory(['ui', 'panel', 'zero'])(state)).toBe(0);
        expect(selectorFactory(['ui', 'panel', 'empty'])(state)).toBeNull();
        expect(selectorFactory(['ui', 'panel', 'empty'], 'empty')(state)).toBeNull();
        expect(selectorFactory(['ui', 'panel', 'notExist'])(state)).toBeUndefined();

        expect(selectorFactory(['data', 'detail'])(state)).toEqual(detail);
        expect(selectorFactory(['data', 'detail', 0])(state)).toEqual(detail[0]);

        const EmptyArray = [];
        expect(selectorFactory(['ui', 'panel', 'notExist'], 'notExist')(state)).toBe('notExist');
        expect(selectorFactory(['ui', 'panel', 'notExist'], EmptyArray)(state)).toEqual(EmptyArray);
    });

    test('selectorFactory 应正确缓存对象', () => {
        const select = selectorFactory(['data']);
        const data_1 = select(state);
        const data_2 = select(state);
        const data_3 = select(state.setIn(['data', 'order', 'remark'], 'remark'));

        expect(data_1).toBe(data_2);
        expect(data_1).not.toBe(data_3);
        const data_3_detail = data_3.detail;
        const data_3_order = data_3.order;
        // expect(data_1.detail).toBe(data_3_detail);
        expect(data_1.order).not.toBe(data_3_order);
    });

    test('mulitSelectorFactory 应使用 array 作为 path', () => {
        expect(() => {
            mulitSelectorFactory()
        }).toThrow('Expected argument to be an array');
        expect(mulitSelectorFactory('')).toThrow('Expected first argument to be an array');
    });

    test('mulitSelectorFactory 应返回正确的值', () => {
        const result = mulitSelectorFactory(
            ['ui', 'panel', 'enable'],
            ['ui', 'panel', 'title'],
            ['ui', 'panel', 'emptyStr'],
            ['ui', 'panel', 'zero'],
            ['ui', 'panel', 'empty'],
            ['ui', 'panel', 'notExist'],
            ['data', 'detail'],
            ['data', 'detail', 0]
        )(state);
        expect(result.enable).toBeFalsy();
        expect(result.title).toEqual('title');
        expect(result.emptyStr).toEqual('');
        expect(result.zero).toEqual(0);
        expect(result.empty).toBeNull();
        expect(result.notExist).toBeUndefined();
        expect(result.detail).toEqual(detail);
        expect(result.detail[0]).toEqual(detail[0]);
    });

    test('mulitSelectorFactory 不应该存在同名属性', () => {
        const fun = () => {
            mulitSelectorFactory(
                ['ui', 'panel', 'enable'],
                ['ui', 'detail', 'enable']
            );
        };
        expect(fun).toThrow('Duplicate name: enable\n the last part of path is duplicate as name of selector\n use structuredSelectorFactory instead')
    });

    test('mulitSelectorFactory 应正确缓存对象', () => {
        const select = mulitSelectorFactory(
            ['ui', 'panel', 'enable'],
            ['ui', 'panel', 'title'],
            ['ui', 'panel', 'emptyStr'],
            ['ui', 'panel', 'zero'],
            ['ui', 'panel', 'empty'],
            ['ui', 'panel', 'notExist'],
            ['data', 'detail'],
            ['data', 'order']
        );
        const data_1 = select(state);
        const data_2 = select(state);
        const data_3 = select(state.setIn(['data', 'order', 'remark'], 'remark'));

        expect(data_1).toBe(data_2);
        expect(data_1).not.toBe(data_3);
        const data_3_detail = data_3.detail;
        const data_3_order = data_3.order;
        expect(data_1.detail).toBe(data_3_detail);
        // expect(data_1.order).toBe(data_3_order);
    });

    test('structuredSelectorFactory 应使用正确参数', () => {
        expect(() => {
            structuredSelectorFactory()
        }).toThrow('Expects argument to be an object');
        expect(structuredSelectorFactory({})).not.toThrow();
        expect(structuredSelectorFactory({ error: {} })).toThrow('Expected first argument to be an array');
    });

    test('structuredSelectorFactory 应返回正确的值', () => {
        const EmptyArray = [];
        const result = structuredSelectorFactory({
            _enable: ['ui', 'panel', 'enable'],
            _title: ['ui', 'panel', 'title'],
            _emptyStr: ['ui', 'panel', 'emptyStr'],
            _zero: ['ui', 'panel', 'zero'],
            _empty: ['ui', 'panel', 'empty'],
            _notExist: ['ui', 'panel', 'notExist'],
            _detail: ['data', 'detail'],
            _detail0: ['data', 'detail', 0],
            _defaultStr: {
                value: ['ui', 'panel', 'notExist'],
                default: 'notExist'
            },
            _defaultArray: {
                value: ['ui', 'panel', 'notExist'],
                default: EmptyArray
            },
            _defaultUndefined: {
                value: ['ui', 'panel', 'notExist']
            }
        })(state);
        expect(result._enable).toBeFalsy();
        expect(result._title).toEqual('title');
        expect(result._emptyStr).toEqual('');
        expect(result._zero).toEqual(0);
        expect(result._empty).toBeNull();
        expect(result._notExist).toBeUndefined();
        expect(result._detail).toEqual(detail);
        expect(result._detail0).toEqual(detail[0]);
        expect(result._defaultStr).toEqual('notExist');
        expect(result._defaultArray).toBe(EmptyArray);
        expect(result._defaultUndefined).toBeUndefined();
    });

    test('structuredSelectorFactory 应正确缓存对象', () => {
        const EmptyArray = [];
        const select = structuredSelectorFactory({
            _enable: ['ui', 'panel', 'enable'],
            _title: ['ui', 'panel', 'title'],
            _emptyStr: ['ui', 'panel', 'emptyStr'],
            _zero: ['ui', 'panel', 'zero'],
            _empty: ['ui', 'panel', 'empty'],
            _notExist: ['ui', 'panel', 'notExist'],
            _detail: ['data', 'detail'],
            _order: ['data', 'order'],
            _defaultArray: {
                value: ['ui', 'panel', 'notExist'],
                default: EmptyArray
            }
        });
        const data_1 = select(state);
        const data_2 = select(state);
        const data_3 = select(state.setIn(['data', 'order', 'remark'], 'remark'));

        expect(data_1).toBe(data_2);
        expect(data_1).not.toBe(data_3);
        const data_3_detail = data_3._detail;
        const data_3_order = data_3._order;
        expect(data_1._detail).toBe(data_3_detail);
        expect(data_1._order).not.toBe(data_3_order);
        // expect(data_1._defaultArray).toBe(_defaultArray);
    });
});
