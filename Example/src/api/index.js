const proxy = require('http-proxy-middleware');

module.exports = app => {
    // 代理远程服务器
    // app.use('/api/v1', proxy({
    //     target:'target server url',
    //     changeOrigin: true,
    //     headers: {'X-USER-ID': 'user.id'}
    // }));
};
