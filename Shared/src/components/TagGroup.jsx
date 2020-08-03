import React from 'react';
import PropTypes from 'prop-types';
import {Tag} from 'antd';
import styles from './tag.css';

const format = (obj, separator) => {
    if(obj === null || obj === undefined)
        return '';
    if(typeof obj === 'string')
        return obj;
    if(Array.isArray(obj))
        return obj.map(format).filter(item => item !== '').join(separator);
    return obj.toString();
};

class WrappedTag extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
    }

    onClose(e) {
        if(typeof this.props.onClose === 'function')
            this.props.onClose(this.props.type, e);
    }

    render() {
        const {value, separator, type, onClose, ...other} = this.props;
        const text = format(value, separator);
        if(text === '')
            return null;
        return (
            <Tag key={type} type={type} {...other} onClose={this.onClose}>
                {text}
            </Tag>
        );
    }
}

WrappedTag.propTypes = {
    /** 标签显示内容*/
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    /** 标签是否可以关闭 */
    closable: PropTypes.bool,
    /** 多值时，用于值拼接的分隔符*/
    separator: PropTypes.string,
    /** 标签类型*/
    type: PropTypes.string,
    /**
     * 关闭时的回调
     * `type`：选项的类型
     * `event`：事件
     * */
    onClose: PropTypes.func
};

WrappedTag.defaultProps = {
    closable: true,
    separator: '、',
    className: styles.fontSizeBig
};

export default class TagGroup extends React.PureComponent {
    render() {
        const {options, ...other} = this.props;
        return (
            <span>
                {options.map(opt => <WrappedTag key={opt.type} type={opt.type} value={opt.value} {...other}/>)}
            </span>
        );
    }
}

TagGroup.propTypes = {
    /**
     * 指定可选项
     * type(string)为选项的类型
     * value(string | array(string))为选项的值
     * */
    options: PropTypes.array.isRequired,
};

