import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import styles from './TextArea.css';

/** 多文本输入框控件。通过回车弹出文本域输入框来实现多文本输入 */
export default class TextArea extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || props.defaultValue || [],
            showPopup: false
        };
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.textareaFocus = this.textareaFocus.bind(this);
        this.emitEmpty = this.emitEmpty.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const prevValue = prevState.prevValue;
        if (prevValue !== nextProps.value) {
            return {
                value: nextProps.value,
                prevValue: nextProps.value
            }
        }
        return null;
    }

    emitEmpty() {
        if (typeof this.props.onChange === 'function')
            this.props.onChange([], this.props.id || this.props.name);
        if (typeof this.props.onBlur === 'function')
            this.props.onBlur([], this.props.id || this.props.name);
    }
    onChange(e) {
        this.setState({ value: e.target.value.split('\n') });
        if (typeof this.props.onChange === 'function')
            this.props.onChange(e.target.value.split('\n').filter(item => item !== ''), this.props.id || this.props.name, e);
    }

    onClick(e) {
        this.setState({ showPopup: true });
        if (typeof this.props.onClick === 'function')
            this.props.onClick(e);
    }

    onBlur(e) {
        const value = this.state.value.map(item => item.trim()).filter(item => item !== '');
        this.setState({
            showPopup: false,
            value
        });
        if (typeof this.props.onBlur === 'function')
            this.props.onBlur(value, this.props.id || this.props.name, e);
    }

    textareaFocus(ref) {
        if (ref && this.state.showPopup)
            ref.focus();
    }

    render() {
        const { value, defaultValue, separator, onChange, onClick, onBlur, autosize, ...other } = this.props;
        let Component = Input;
        const suffix = !this.state.showPopup && this.state.value && this.state.value.length > 0 && !this.props.disabled
            ?
            <Icon type="close-circle" onClick={this.emitEmpty} />
            : null
        if (this.state.showPopup) {
            Component = Input.TextArea;
            other.autosize = autosize
        }
        return (
            <div className={styles.textareaWrap}>
                <Component className={this.state.showPopup ? styles.textarea : styles.text}
                    value={this.state.value.join(this.state.showPopup ? '\n' : separator)}
                    onChange={this.onChange}
                    suffix={suffix}
                    onClick={this.onClick}
                    onBlur={this.onBlur}
                    ref={this.textareaFocus}
                    {...other} />
            </div>
        );
    }
}

TextArea.propTypes = {
    autosize: PropTypes.object,
    /** 控件的唯一性标识，会在`onChange()`回调函数中使用。 */
    id: PropTypes.string,
    /** 控件的表单名称，如果没有指定`id`属性，那么该值会在`onChange()`回调函数中使用。 */
    name: PropTypes.string,
    /** 控件的初始值。 uncontrolled component used */
    defaultValue: PropTypes.array,
    /** 控件单行显示时，输入项分隔符。 */
    separator: PropTypes.string,
    /** 控件的值。 controlled component used */
    value: PropTypes.array,
    /**
     * 在文本框失去焦点时会调用该方法。
     * 参数：
     * `value ([string])`：文本框中当前的值。
     * `id`：控件标识
     * `event`：事件：
     */
    onBlur: PropTypes.func,
    /**
     * 在文本框值有变化时会调用该方法。
     * 参数：
     * `value ([string])`：文本框中当前的值。
     * `id`控件标识
     * `event`：事件
     */
    onChange: PropTypes.func,
    onClick: PropTypes.func
};

TextArea.defaultProps = {
    autosize: {
        minRows: 2,
        maxRows: 10
    },
    separator: ','
};
