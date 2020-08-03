import { enumManager, EnumItem, Enum } from '../enumType'

const CN = 'zh-test', EN = 'en-test';
enumManager.setLanguages({
    [CN]: {
        name: "简体中文",
        flag: "cn"
    },
    [EN]: {
        name: "U.S. English",
        flag: "us"
    }
});
enumManager.setDefaultLanguage(CN);

describe('测试 enumType', () => {
    it('proto EnumItem getText() return undefined', () => {
        expect(EnumItem.getText()).toBeUndefined();
    });

    it('proto Enum has() return false', () => {
        expect(Enum.has()).toBeFalsy();
        expect(Enum.has('key')).toBeFalsy();
    });

    it('proto Enum toList() return []', () => {
        expect(Enum.toList()).toEqual([]);
    });

    const status = Object.freeze({
        __proto__: Enum,
        冻结: 0,
        新建: 1,
        检验完成: '2',
        properties: Object.freeze({
            0: Object.freeze({
                __proto__: EnumItem,
                [CN]: '冻结',
                [EN]: 'frozen'
            }),
            1: Object.freeze({
                __proto__: EnumItem,
                [CN]: '新建',
                [EN]: 'new'
            }),
            '2': Object.freeze({
                __proto__: EnumItem,
                [CN]: '检验完成',
                [EN]: ''
            })
        })
    });

    const cnList = [{
        value: 0,
        text: '冻结'
    }, {
        value: 1,
        text: '新建'
    }, {
        value: '2',
        text: '检验完成'
    }];
    const enList = [{
        value: 0,
        text: 'frozen'
    }, {
        value: 1,
        text: 'new'
    }, {
        value: '2',
        text: ''
    }];

    it('Enum get value 应该返回正确键值', () => {
        expect(status.冻结).toBe(0);
        expect(status.新建).toBe(1);
        expect(status.检验完成).toBe('2');
        expect(status.作废).toBeUndefined();
    });

    it('Enum get text 应该返回正确键值', () => {
        expect(status.properties[0].getText()).toBe('冻结');
        expect(status.properties[1].getText()).toBe('新建');
        expect(status.properties[2].getText()).toBe('检验完成');
        expect(status.properties['0'].getText()).toBe('冻结');
        expect(status.properties['1'].getText()).toBe('新建');
        expect(status.properties['2'].getText()).toBe('检验完成');
        expect(status.properties[1].getText(CN)).toBe('新建');
        expect(status.properties[1].getText(EN)).toBe('new');
        expect(status.properties[1].getText('other')).toBe('新建');
    });

    it('Enum has() 应该正确判断值是否存在', () => {
        expect(status.has(0)).toBe(true);
        expect(status.has('0')).toBe(true);
        expect(status.has(1)).toBe(true);
        expect(status.has('1')).toBe(true);
        expect(status.has(2)).toBe(true);
        expect(status.has('2')).toBe(true);
        expect(status.has()).toBeFalsy();
        expect(status.has(10)).toBeFalsy();
    });

    it('Enum toList() 应该返回正确 value/text 数组', () => {
        expect(status.toList()).toEqual(cnList);
        expect(status.toList(CN)).toEqual(cnList);
        expect(status.toList(EN)).toEqual(enList);
        expect(status.toList('other')).toEqual(cnList);
    });

    it('Enum map() 正确调用callback并传递相关属性', () => {
        let callback = jest.fn();
        status.map(callback, EN);
        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenNthCalledWith(1, enList[0], 0, enList);
        expect(callback).toHaveBeenNthCalledWith(2, enList[1], 1, enList);
        expect(callback).toHaveBeenNthCalledWith(3, enList[2], 2, enList);

        callback = jest.fn();
        status.map(callback);
        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenNthCalledWith(1, cnList[0], 0, cnList);
        expect(callback).toHaveBeenNthCalledWith(2, cnList[1], 1, cnList);
        expect(callback).toHaveBeenNthCalledWith(3, cnList[2], 2, cnList);

        callback = jest.fn();
        status.map(callback, 'other');
        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenNthCalledWith(1, cnList[0], 0, cnList);
        expect(callback).toHaveBeenNthCalledWith(2, cnList[1], 1, cnList);
        expect(callback).toHaveBeenNthCalledWith(3, cnList[2], 2, cnList);
    });

    it('Enum pack() 返回正确的枚举类型', () => {
        const packEnum = Object.freeze({
            __proto__: Enum,
            项目0: 0,
            项目1: '1',
            项目2: 2,
            properties: Object.freeze({
                '0': Object.freeze({
                    __proto__: EnumItem,
                    [CN]: '项目0',
                    [EN]: 'zero'
                }),
                '1': Object.freeze({
                    __proto__: EnumItem,
                    [CN]: '项目1',
                    [EN]: 'one'
                }),
                '2': Object.freeze({
                    __proto__: EnumItem,
                    [CN]: '项目2',
                    [EN]: 'two'
                })
            })
        });

        let result = packEnum.pick([packEnum.项目0, packEnum.项目1, 99]);
        expect(result).toEqual({
            __proto__: Enum,
            项目0: 0,
            项目1: '1',
            properties: {
                '0': {
                    __proto__: EnumItem,
                    [CN]: '项目0',
                    [EN]: 'zero'
                },
                '1': {
                    __proto__: EnumItem,
                    [CN]: '项目1',
                    [EN]: 'one'
                },
            }
        })


        const txtsetter = jest.fn();
        txtsetter.mockReturnValueOnce({[CN]: '测试', [EN]: 'test'}).mockReturnValue({[CN]: '测试1', [EN]: 'test1'});
        result = packEnum.pick([packEnum.项目0, packEnum.项目1], txtsetter);
        expect(result).toEqual({
            __proto__: Enum,
            项目0: 0,
            项目1: '1',
            properties: {
                '0': {
                    __proto__: EnumItem,
                    [CN]: '测试',
                    [EN]: 'test'
                },
                '1': {
                    __proto__: EnumItem,
                    [CN]: '测试1',
                    [EN]: 'test1'
                },
            }
        });
        expect(txtsetter).toHaveBeenCalledTimes(2);
        expect(txtsetter).toHaveBeenNthCalledWith(1, packEnum.项目0, packEnum.properties[packEnum.项目0]);
        expect(txtsetter).toHaveBeenNthCalledWith(2, packEnum.项目1, packEnum.properties[packEnum.项目1]);
    });
});
