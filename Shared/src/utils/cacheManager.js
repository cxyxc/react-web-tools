import localforage from 'localforage';

let reduxStateCache = null;
let cacheManager = localforage;


cacheManager.init = options => {
    if (!options) {
        const config = {
            storeName: window.location.pathname.replace('/', '_')
        };
        localforage.config(config);
    }
    else
        localforage.config(options);
};

cacheManager.setStateCache = value => {
    reduxStateCache = value;
};

cacheManager.saveStateCache = key => {
    if (reduxStateCache && key)
        return localforage.setItem(key, JSON.stringify(reduxStateCache))
            .catch(error => {
                console.warn(error.message);
            });
    else {
        console.log('stateCache can not save.');
        return Promise.resolve();
    }
};

cacheManager.getStateCache = key => {
    return localforage.getItem(key).then(value => {
        try {
            return JSON.parse(value);
        }
        catch (error) {
            return null;
        }
    });
};

export default cacheManager;
