import RouteManager from '../routeManager';
import { Routes } from '../routeManager';
describe('Routes', () => {
    test('new Routes', () => {
        const data = {
            query: {
                url: '/',
                title: '产品列表',
            },
            import: {
                url: '/import',
                title: '导入',
            },
            add: {
                url: '/add',
                title: '新增产品分类',
            },
            update: {
                url: '/:id/update',
                title: '编辑产品分类',
                format: '/{0}/update'
            }
        }
        const routes = new Routes(data);
        expect(typeof routes.setPageUrl).toBe('function');
        expect(typeof routes.update.format).toBe('function');
        expect(typeof routes.update.url).toBe('function');
        expect(routes.update.title).toEqual(data.update.title);
    });
    test('setPageUrl', () => {
        const data = {
            update: {
                url: '/:id/update',
                title: '编辑产品分类',
                format: '/{0}/update'
            }
        }
        const routes = new Routes(data);
        const url = '/test'
        routes.setPageUrl(url)
        expect(routes.pageUrl).toEqual(url);
    });
    test('format is exist', () => {
        const data = {
            update: {
                url: '/:id/update',
                title: '编辑产品分类',
                format: '/{0}/update'
            }
        }
        const id = 65;
        const routes = new Routes(data);
        const result = routes.update.format(65);
        expect(result).toEqual(`/${id}/update`);
        const newResult = routes.update.format();
        expect(newResult).toEqual('/{0}/update');
    });
    test('format is not exist', () => {
        const data = {
            add: {
                url: '/add',
                title: '新增产品分类',
            }
        }
        const routes = new Routes(data);
        const result = routes.add.format();
        expect(result).toEqual(data.add.url);
    });
    test('combineUrl', () => {
        const data = {
            update: {
                url: '/:id/update',
                title: '编辑产品分类',
                format: '/{0}/update'
            }
        };
        const pageUrl = '/sales';
        const routes = new Routes(data, pageUrl);
        expect(routes.update.url()).toBe(`${pageUrl}${data.update.url}`)
    });
    test('stringFormat return error', () => {
        const data = {
            update: {
                url: '/:id/update',
                title: '编辑产品分类',
                format: id => `/${id}/update`
            }
        }
        const id = 65;
        const routes = new Routes(data);
        try {
            const result = routes.update.format([id]); 
        } catch (error) {
            expect(error.message).toMatch('Expected first argument to be a string');
        }
        
    });
})
describe('RouteManager', () => {
    beforeEach(() => {
        RouteManager.setRoutes({});
    })
    test('new RouteManager', () => {
        expect(typeof RouteManager.setRoutes).toBe('function');
        expect(typeof RouteManager.getLocation).toBe('function');
        expect(typeof RouteManager.getPagePath).toBe('function');
        expect(typeof RouteManager.getParentUrl).toBe('function');
    });
    describe('getLocation', () => {
        test('window.location.hash is empty', () => {
            window.location.hash = '';
            const result = RouteManager.getLocation()
            expect(result).toEqual({
                pathname: '/',
                search: '',
            });
        });
        test('window.location,hash is not empty', () => {
            jsdom.reconfigure({
                url: 'http://localhost:3000/sales/vehicleStock/#forWarehouseBinArrangeTask?pageIndex=10',
            });
            const result = RouteManager.getLocation()
            expect(result).toEqual({
                pathname: 'forWarehouseBinArrangeTask',
                search: '?pageIndex=10',
            });
        })
    });
    describe('getPagePath', () => {
        const routes = new Routes({
            query: {
                url: '/',
                title: '产品列表',
            },
            import: {
                url: '/import',
                title: '导入',
            },
            add: {
                url: '/add',
                title: '新增产品分类',
            },
            update: {
                url: '/:id/update',
                title: '编辑产品分类',
                format: '/{0}/update'
            }
        });
        test('argments is not empty', () => {
            const location = {
                pathname: '/1000200/update',
                search: '',
            }
            const result = RouteManager.getPagePath({
                namespace: '',
                location,
                routes,
                language: 'zh-CN'
            });
            expect(result).toEqual([{
                title: '编辑产品分类',
                url: '/1000200/update'
            }]);
        });
        test('argments is empty', () => {
            jsdom.reconfigure({
                url: 'http://localhost:3000/sales/productManual/#/add',
            });
            RouteManager.setRoutes({
                namespace: '',
                routes
            }); 
            const result = RouteManager.getPagePath({});
            expect(result).toEqual([{
                title: '新增产品分类',
                url: '/add'
            }]);
        });
    });
    describe('getParentUrl', () => {
        jsdom.reconfigure({
            url: 'http://localhost:3000/auth/role/#/add/import',
        });
        test('getParentUrl return paths', () => {
            const routes = new Routes({
                add: {
                    url: '/add',
                    title: '新增',
                },
                import: {
                    url: '/add/import',
                    title: '导入',
                },
            });
            const location = {
                pathname: '/add/import',
                search: '',
            };
            RouteManager.setRoutes({
                namespace: '',
                routes
            }); 
            const result = RouteManager.getParentUrl({
                namespace: '',
                location,
                routes,
            });
            expect(result).toEqual('/add');
        });
        test('getParentUrl return /', () => {
            RouteManager.getPagePath = jest.fn(() => [
                { 
                    url: '/add',
                    title: '新增'
                },
            ]);
            const result = RouteManager.getParentUrl({});
            expect(result).toEqual('/');
        });
    });
})