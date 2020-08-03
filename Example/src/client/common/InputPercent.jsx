import React, {PureComponent} from 'react';
import WrappedInputNumber from './WrappedInputNumber';
import {separator} from './localize';

// 目前 value 百分比展示2位小数，正常可以确保显示，eg. 12.34%（0.1234）
const div100 = value => value ? Number(value) * Math.pow(10, 6) / Math.pow(10, 8) : value;
const mul100 = value => value ? Number(value) * Math.pow(10, 6) / Math.pow(10, 4) : value;

const localParser = (precision, value) => {
    // 仅保留数字、小数点、负号 - 根据精度截断
    // antd 设置 decimalSeparator 后，不需要考虑国际化小数点转换问题
    const regExp = precision === undefined ? /[-0-9]*\.?[0-9]*/ : new RegExp(`[-0-9]*\\.?[0-9]{0,${precision}}`);
    return regExp.exec(value.replace(/[^-0-9.]+/g, ''))[0];
};
const localFormatter = value => `${value}%`;

/*eslint-disable react/prop-types*/
class InputPercent extends PureComponent {
    constructor(props) {
        super(props);
        this.onChange = typeof props.onChange === 'function' ? (value, name) => props.onChange(div100(value), name) : null;
        this.onBlur = typeof props.onBlur === 'function' ? (value, name, e) => props.onBlur(div100(value), name, e) : null;
        // 暂时不考虑 precision 为可变值
        this.parser = localParser.bind(this, isNaN(parseInt(props.precision, 10)) ? undefined : Math.max(props.precision - 2, 0));
    }

    render() {
        const {onChange, onBlur, formatter, parser, decimalSeparator, defaultValue, value, max, min, step, precision, ...rest} = this.props;
        const params = {
            defaultValue: isNaN(Number(defaultValue)) ? defaultValue : mul100(defaultValue),
            value: isNaN(Number(value)) ? value : mul100(value),
            max: isNaN(Number(max)) ? max : mul100(max),
            min: isNaN(Number(min)) ? min : mul100(min),
            step: isNaN(Number(step)) ? step : mul100(step)
        };
        // antd 使用如下判断决定 precision 处理
        // eg params.precision = undefined or null，时等同于 precision = 0
        if('precision' in this.props)
            params.precision = isNaN(parseInt(precision, 10)) ? precision : Math.max(precision - 2, 0);
        return (
            <WrappedInputNumber
                decimalSeparator={separator.decimalSeparator}
                formatter={localFormatter}
                parser={this.parser}
                onChange={this.onChange}
                onBlur={this.onBlur}
                {...params}
                {...rest} />
        );
    }
}

export default InputPercent;
