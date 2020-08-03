
export function filterProps(props, whitelist, defaults = {}) {
    return whitelist.reduce((filtered, name) => {
        if(props.hasOwnProperty(name)) {
            filtered[name] = props[name];
        } else if(defaults.hasOwnProperty(name)) {
            filtered[name] = defaults[name];
        }
  
        return filtered;
    }, {});
}

export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}