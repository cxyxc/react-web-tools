import React, {PureComponent} from 'react';
import {formatNumber, separator} from './localize';
import WrappedInputNumber from './WrappedInputNumber';
import {AMOUNT_FORMAT} from '../constants';

// 规避 Object.is，IE 不支持
const isNegativeZero = number => number === 0 && (1 / number) === -Infinity;

const decimalSeparator = separator.decimalSeparator === '.' ? '\\.' : separator.decimalSeparator;
const isDot = separator.decimalSeparator === '.';

const localFormatter = (format, value) => {
    if(!value && value !== 0)
        return '';

    // 优化符号输入
    if(value === '.')
        value = '0.';
    else if(value === '-')
        value = '-0';

    // 支持负数输入
    const negativeZero = isNegativeZero(parseFloat(value));

    // 去除 formatNumber 格式化时自动补充的 0，避免 antd 输入光标定位问题
    const decimal = value.toString().split('.')[1];
    const number = formatNumber(value, format);
    const result = decimal === undefined
        ? number.replace(new RegExp(`${decimalSeparator}0+`), '')
        : number.match(new RegExp(`.*${decimalSeparator}[0-9]{${decimal.length}}`))[0] + number.match(/\D*$/)[0];

    return negativeZero && result.indexOf('-') === -1 ? `-${result}` : result;
};

const localParser = (precision, value) => {
    if(!value)
        return '';

    // 仅保留数字、小数点、负号 - 移除重复小数点、负号 - 根据精度截断
    const result = value.replace(new RegExp(`[^-0-9${decimalSeparator}]+`, 'g'), '').match(new RegExp(`[-0-9]*${decimalSeparator}?[0-9]{0,${precision}}`))[0];

    // js parseFloat 仅支持 . 作为小数点符号
    return isDot ? result : result.replace(decimalSeparator, '.');
};

/*eslint-disable react/prop-types*/
class InputAmount extends PureComponent {
    constructor(props) {
        super(props);
        // 允许指定小数位，为空则默认为 AMOUNT_FORMAT minimumFractionDigits
        if(typeof props.precision === 'number') {
            this.formatter = localFormatter.bind(this, Object.assign({}, AMOUNT_FORMAT, {minimumFractionDigits: props.precision}));
            this.parser = localParser.bind(this, this.props.precision);
            this.state = {precision: this.props.precision};
        } else {
            const format = Object.assign({minimumFractionDigits: 2}, AMOUNT_FORMAT);
            this.formatter = localFormatter.bind(this, format);
            this.parser = localParser.bind(this, format.minimumFractionDigits);
            this.state = {precision: format.minimumFractionDigits};
        }
    }

    render() {
        const {parser, formatter, decimalSeparator, precision, ...rest} = this.props;
        return <WrappedInputNumber formatter={this.formatter} parser={this.parser} precision={this.state.precision} {...rest} />;
    }
}


InputAmount.defaultProps = {
    min: 0
};

export default InputAmount;
