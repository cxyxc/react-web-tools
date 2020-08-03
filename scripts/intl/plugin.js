function getKey(properties = []) {
    let key = null;
    properties.forEach(item => {
        if((item.key && item.key.name === 'id') || // CallExpression
        (item.name && item.name.name === 'id')) // JSXOpeningElement
            key = item.value.value;
    });
    return key;
}

function getValue(properties = []) {
    let value = null;
    properties.forEach(item => {
        if((item.key && item.key.name === 'defaultMessage') ||
        (item.name && item.name.name === 'defaultMessage'))
            value = item.value.value;
    });
    return value;
}

module.exports = (manager, assert) => function({types: t}) {
    return {
        name: 'intl-plugin',
        visitor: {
            CallExpression: path => {
                if(path.node.callee.type === 'MemberExpression' &&
                    path.node.callee.property.type === 'Identifier' &&
                    path.node.callee.property.name === 'formatMessage' &&
                    path.node.arguments[0] &&
                    path.node.arguments[0].type === 'ObjectExpression') {
                    // 此时即认为是 this.props.intl.formatMessage({id: 'XXX', defaultMessage: 'XXX'})
                    const description = path.node.arguments[0];
                    const key = getKey(description.properties);
                    const value = getValue(description.properties);
                    const lineStart = path.node.callee.property.start;
                    assert(description && key, 'formatMessage 参数缺失', lineStart);
                    
                    const {ok, message} = manager.setLocalization(key, value || '');
                    assert(ok, message, lineStart);
                }
                
                if(path.node.callee.type === 'Identifier' &&
                    path.node.callee.name === 'formatMessage' &&
                    path.node.arguments[0] &&
                    path.node.arguments[0].type === 'ObjectExpression') {
                    // 此时即认为是 formatMessage({id: 'XXX', defaultMessage: 'XXX'})
                    const description = path.node.arguments[0];
                    const key = getKey(description.properties);
                    const value = getValue(description.properties);
                    const lineStart = path.node.callee.start;
                    assert(description && key, 'formatMessage 参数缺失', lineStart);

                    const {ok, message} = manager.setLocalization(key, value || '');
                    assert(ok, message, lineStart);
                }
            },
            JSXOpeningElement: path => {
                if(path.node.name.name === 'FormattedMessage') {
                    // 此时认为是  <FormattedMessage id="XXX" defaultMessage="XXX" />
                    const key = getKey(path.node.attributes);
                    const value = getValue(path.node.attributes);
                    const lineStart = path.node.start;
                    assert(key, 'FormattedMessage props id 缺失', lineStart);

                    const {ok, message} = manager.setLocalization(key, value || '');
                    assert(ok, message, lineStart);
                }
            }
        }
    };
};
