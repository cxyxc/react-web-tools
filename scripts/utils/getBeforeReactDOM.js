const fs = require('fs');
const {join} = require('path');
const {NODE_MODULES, isModule, cwd} = require('./tools');

module.exports = function getBeforeReactDOM(filePath) {
    const absFilePath = isModule(filePath) ? join(NODE_MODULES, filePath) : join(cwd, filePath);
    if(!fs.existsSync(absFilePath)) {
        console.error('[getBeforeReactDOM]: No file found');
        return '';
    }
    return fs.readFileSync(absFilePath);
};
