import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {InputNumber} from 'antd';

const isEmpty = number => !number && number !== 0;

class WrappedInputNumber extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || props.value || ''
        };
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const prevValue = prevState.prevValue;
        // 参考 antd 实现，避免 null / undefined / NaN 意外情况
        if(prevValue !== nextProps.value && `${prevValue}` !== `${nextProps.value}`)
            return {
                value: nextProps.value,
                prevValue: nextProps.value
            };

        return null;
    }

    onChange(value) {
        this.setState({
            value
        });
        if(typeof this.props.onChange === 'function')
            this.props.onChange(value, this.props.name || this.props.id);
    }

    onBlur(e) {
        let value = this.state.value;
        if(isEmpty(value) && !isEmpty(this.props.defaultValue)) {
            value = this.props.defaultValue;
            this.setState({
                value
            });
        }
        if(typeof this.props.onBlur === 'function')
            this.props.onBlur(value, this.props.name || this.props.id, e);
    }

    render() {
        const {onChange, onBlur, defaultValue, value, ...rest} = this.props;
        return (
            <InputNumber {...rest}
                value={this.state.value}
                onChange={this.onChange}
                onBlur={this.onBlur}/>
        );
    }
}

WrappedInputNumber.propTypes = {
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    name: PropTypes.string,
    /**
     * 默认值，相当于 Default
     */
    defaultValue: PropTypes.number,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
};
export default WrappedInputNumber;
