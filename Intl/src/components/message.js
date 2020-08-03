import {Component, createElement, isValidElement} from 'react';
import PropTypes from 'prop-types';

export default function createFormattedMessage(formatMessage) {
    return class FormattedMessage extends Component {
        static displayName = 'FormattedMessage';
      
        static propTypes = {
            id: PropTypes.string.isRequired,
            children: PropTypes.func,
            defaultMessage: PropTypes.string,
            description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            tagName: PropTypes.string,
            values: PropTypes.object,
        };
        
        static defaultProps = {
            values: {},
        };
      
        render() {
            const {
                id,
                description,
                defaultMessage,
                values,
                tagName: Component = 'span',
                children,
            } = this.props;
      
            let tokenDelimiter = null;
            let tokenizedValues = null;
            let elements = null;
      
            const hasValues = values && Object.keys(values).length > 0;
            if(hasValues) {
                // Creates a token with a random UID that should not be guessable or
                // conflict with other parts of the `message` string.
                const uid = Math.floor(Math.random() * 0x10000000000).toString(16);
      
                const generateToken = (() => {
                    let counter = 0;
                    return () => `ELEMENT-${uid}-${(counter += 1)}`;
                })();
      
                // Splitting with a delimiter to support IE8. When using a regex
                // with a capture group IE8 does not include the capture group in
                // the resulting array.
                tokenDelimiter = `@__${uid}__@`;
                tokenizedValues = {};
                elements = {};
      
                // Iterates over the `props` to keep track of any React Element
                // values so they can be represented by the `token` as a placeholder
                // when the `message` is formatted. This allows the formatted
                // message to then be broken-up into parts with references to the
                // React Elements inserted back in.
                Object.keys(values).forEach(name => {
                    const value = values[name];
      
                    if(isValidElement(value)) {
                        const token = generateToken();
                        tokenizedValues[name] = tokenDelimiter + token + tokenDelimiter;
                        elements[token] = value;
                    } else
                        tokenizedValues[name] = value;
                });
            }
      
            const descriptor = {id,
                description,
                defaultMessage};
            const formattedMessage = formatMessage(descriptor, tokenizedValues || values);
      
            let nodes = null;
      
            const hasElements = elements && Object.keys(elements).length > 0;
            if(hasElements)
                // Split the message into parts so the React Element values captured
                // above can be inserted back into the rendered message. This
                // approach allows messages to render with React Elements while
                // keeping React's virtual diffing working properly.
                nodes = formattedMessage
                    .split(tokenDelimiter)
                    .filter(part => Boolean(part))
                    .map(part => elements[part] || part);
            else
                nodes = [formattedMessage];
          
      
            if(typeof children === 'function')
                return children(...nodes);
          
            // Needs to use `createElement()` instead of JSX, otherwise React will
            // warn about a missing `key` prop with rich-text message formatting.
            return createElement(Component, null, ...nodes);
        }
    };
}
  
