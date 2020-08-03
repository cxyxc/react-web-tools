import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';
import { injectIntl } from '../localizations/intl';

const RangePicker = DatePicker.RangePicker;

const generateShowHourMinuteSecond = (format) => {
    // Ref: http://momentjs.com/docs/#/parsing/string-format/
    return {
        showHour: (
            format.indexOf('H') > -1 ||
            format.indexOf('h') > -1 ||
            format.indexOf('k') > -1
        ),
        showMinute: format.indexOf('m') > -1,
        showSecond: format.indexOf('s') > -1,
    };
}

export class DateRangePicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(dates, dateStrings) {
        if (typeof this.props.onChange === 'function')
            if (this.props.showTime) {
                if (this.props.showTime.format) {
                    const timeOptions = generateShowHourMinuteSecond(this.props.showTime.format);
                    if (timeOptions.showMinute) {
                        this.props.onChange(dates.length < 2 ? [] : [
                            dates[0].startOf('minute').toDate(),
                            dates[1].endOf('minute').toDate()
                        ], this.props.id || this.props.name)
                        return;
                    }
                    if (timeOptions.showHour) {
                        this.props.onChange(dates.length < 2 ? [] : [
                            dates[0].startOf('hour').toDate(),
                            dates[1].endOf('hour').toDate()
                        ], this.props.id || this.props.name)
                        return;
                    }
                }
                else
                    this.props.onChange(dates, this.props.id || this.props.name);
            }
            else
                this.props.onChange(dates.length < 2 ? [] : [
                    dates[0].startOf('day').toDate(),
                    dates[1].endOf('day').toDate()
                ], this.props.id || this.props.name);
    }

    render() {
        const { id, name, value, onChange, ranges, ...other } = this.props;
        const {formatMessage} = this.props.intl;

        const dateRanges = ranges || {
            [formatMessage({
                id: 'COMMON_DATE_RANGE_TODAY',
                defaultMessage: '今天'
            })]: [moment().startOf('day'), moment().endOf('day')],
            [formatMessage({
                id: 'COMMON_DATE_RANGE_LAST_3_DAY',
                defaultMessage: '最近3天'
            })]: [moment().subtract(2, 'day').startOf('day'), moment().endOf('day')],
            [formatMessage({
                id: 'COMMON_DATE_RANGE_LAST_7_DAY',
                defaultMessage: '最近7天'
            })]: [moment().subtract(6, 'day').startOf('day'), moment().endOf('day')],
            [formatMessage({
                id: 'COMMON_DATE_RANGE_LAST_30_DAY',
                defaultMessage: '最近30天'
            })]: [moment().subtract(29, 'day').startOf('day'), moment().endOf('day')],
            [formatMessage({
                id: 'COMMON_DATE_RANGE_THIS_MONTH',
                defaultMessage: '本月'
            })]: [moment().startOf('month'), moment().endOf('month')],
            [formatMessage({
                id: 'COMMON_DATE_RANGE_THIS_YEAR',
                defaultMessage: '今年'
            })]: [moment().startOf('year'), moment().endOf('year')]
        };

        const dates = [];
        if (value && value.length > 0) {
            if (moment(value[0]).isValid())
                dates[0] = moment(value[0], this.props.format);
            if (moment(value[1]).isValid())
                dates[1] = moment(value[1], this.props.format);
        }

        return (
            <RangePicker id={id}
                value={dates}
                ranges={dateRanges}
                onChange={this.onChange}
                {...other} />
        );
    }
}

DateRangePicker.propTypes = {
    /** 展示的日期格式 */
    format: PropTypes.string,
    /** 控件的唯一性标识，会在`onChange()`回调函数中使用。 */
    id: PropTypes.string,
    /** 控件的表单名称，如果没有指定`id`属性，那么该值会在`onChange()`回调函数中使用。 */
    name: PropTypes.string,
    /** 预设时间范围快捷选择 */
    ranges: PropTypes.object,
    /** 增加时间选择功能*/
    showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    /** 控件大小 */
    size: PropTypes.oneOf(['large', 'default', 'small']),
    /** 控件的初始值，value[0]为起始日期，value[1]为结束日期。 */
    value: PropTypes.arrayOf(Date),
    /**
     * 在日期范围值发生变化时会调用该方法。
     * 参数：
     * `value (array)`：当前选定的日期范围，value[0]为起始日期，value[1]为结束日期。
     * `id (string)`：控件的`id`或者`name`属性的值
     */
    onChange: PropTypes.func,
    intl: PropTypes.object,
};

DateRangePicker.defaultProps = {
    format: 'L',
    showTime: false
};

export default injectIntl(DateRangePicker);
