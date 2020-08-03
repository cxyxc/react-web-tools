module.exports = {
    compile: {
        shell: '@shsdt/web-shell',
        bootstrapper: '@shsdt/web-bootstrap',
        topMenus: [],
        workingDir: './temp',
        dependencies: './src/client',
        api: './src/api',
        debug: false
    },
    dev: {
        host: 'localhost',
        port: 3000,
        hot: true
    },
    mock: {},
    runtime: {}
};
