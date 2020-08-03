import stringify from '../stringify';
import qs from 'qs';

describe("stringify", () => {
    test("should return empty string when [obj = undefined] ", () => {
        const obj = undefined;
        const result = stringify(obj);
        expect(result).toBe("");
    })
    test("should ignore null or undefined field", () => {
        const obj = {
            a: null,
            b: undefined,
            c: 1
        }
        const result = stringify(obj);
        expect(result).toBe("c=1");
    })
    test("collectionFormat ssv", () => {
        const obj = {
            a: [1, 2]
        }
        const result = stringify(obj, 'ssv');
        expect(result).toBe("a=1%202");
    })
    test("collectionFormat csv", () => {
        const obj = {
            a: [1, 2]
        }
        const result = stringify(obj, 'csv');
        expect(result).toBe("a=1%2C2");
    })
    test("collectionFormat tsv", () => {
        const obj = {
            a: [1, 2]
        }
        const result = stringify(obj, 'tsv');
        expect(result).toBe("a=1%5C2");
    })
    test("collectionFormat multi", () => {
        const obj = {
            a: [1, 2]
        }
        const result = stringify(obj, 'multi');
        expect(result).toBe("a=1&a=2");
    })
    test("line 13 item.length === 0", () => {
        const obj = {
            a: [],
        }
        const result = stringify(obj);
        expect(result).toBe("");
    })
    test("default collectionFormat equal 'pipes' when not set", () => {
        const obj = {
            a: [1, 2]
        }
        const qsSpy = jest.spyOn(qs, "stringify");
        const result = stringify(obj);
        expect(qsSpy.mock.calls[0][0].a).toBe("1|2");
    })
})