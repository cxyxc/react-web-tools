import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Tag} from 'antd';

class WrappedTag extends PureComponent {
    onClose = () => {
        this.props.onClose(this.props.name || this.props.id);
    }
    render() {
        const {id, name, onClose, ...rest} = this.props;
        return (
            <Tag {...rest} onClose={this.onClose}>
                {this.props.children}
            </Tag>
        );
    }
}

WrappedTag.propTypes = {
    children: PropTypes.any,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    onClose: PropTypes.func,
};

export default WrappedTag;
