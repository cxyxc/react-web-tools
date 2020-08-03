import {EnumItem, Enum} from '@shsdt/web-shared/lib/utils/enumType';
const CN = 'zh-CN';

// icon 类型
export const iconType = Object.freeze({
    __proto__: Enum,
    font: 1,
    url: 2,
    properties: Object.freeze({
        '1': Object.freeze({
            __proto__: EnumItem,
            [CN]: 'font'
        }),
        '2': Object.freeze({
            __proto__: EnumItem,
            [CN]: 'url'
        })
    })
});
