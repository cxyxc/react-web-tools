import cacheManager from '../cacheManager';
import localforage from 'localforage';
describe('cacheManager', () => {
    afterEach(() => {
        cacheManager.setStateCache(null);
    })
    test('has method', () => {
        expect(typeof cacheManager.init).toBe('function');
        expect(typeof cacheManager.setStateCache).toBe('function');
        expect(typeof cacheManager.saveStateCache).toBe('function');
        expect(typeof cacheManager.getStateCache).toBe('function');
    });
    test('init options is empty', () => {
        localforage.config = jest.fn(() => {});
        cacheManager.init();
        expect(localforage.config).toBeCalled();
    });
    test('init options is not empty', () => {
        localforage.config = jest.fn(() => {});
        cacheManager.init({key: 'value'});
        expect(localforage.config).toBeCalled();
    });
    test('saveStateCache key is empty', () => {
        const result = cacheManager.saveStateCache();
        expect(result).resolves.toBe(undefined)
    });
    test('saveStateCache key is not empty', () => {
        const value = 'value';
        const key = 'key';
        cacheManager.setStateCache(value);
        return cacheManager.saveStateCache(key).then(data => {
            expect(JSON.parse(data)).toEqual('value');
        })
    });
    //TODO 无法进入line 40 此分支进行测试 ,
    test('getStateCache should return null', () => {
        const key = 'testKey';
        cacheManager.setStateCache(() => {});
        return cacheManager.saveStateCache(key).then(() => {
            return cacheManager.getStateCache(key).then(data => {
                expect(data).toBeNull();
            })
        });
    });
    test('getStateCache should return value', () => {
        const value = 'value';
        const key = 'testKey';
        cacheManager.setStateCache(value);
        return cacheManager.saveStateCache(key).then(() => {
            return cacheManager.getStateCache(key).then(data => {
                expect(data).toEqual('value');
            })
        });
        
    });
})