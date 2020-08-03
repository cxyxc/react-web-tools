export default (app, config) => {
    app.get('/api/v1/users/me', (req, res) => {
        res.json({
            payload: (config && config.currentUserInfo) || {}
        });
    });
    
    app.get('/api/v1/users/me/pages', (req, res) => {
        res.json({
            payload: (config && config.menus) || []
        });
    });
};
