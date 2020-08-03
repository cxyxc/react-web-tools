import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Select, Button, Icon, Spin, Input, Tooltip} from 'antd';
import debounce from 'lodash/debounce';
import styles from './SearchSelect.css';
import classnames from 'classnames';
import {injectIntl} from '../localizations/intl';

const Option = Select.Option;
const InputGroup = Input.Group;
const convertValue = (data, keyIndex, labelMap) => data
    ? {
        key: data[keyIndex],
        label: labelMap(data)
    }
    : [];

class SearchSelect extends PureComponent {
    static getDerivedStateFromProps(nextProps, state) {
        if(nextProps.value !== state.propsValue)
            return {
                value: convertValue(nextProps.value, nextProps.keyIndex, nextProps.labelMap),
                propsValue: nextProps.value
            };
        return null;
    }
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.onQuery = debounce(this.onQuery, props.delay);
    }
    state = {
        isFetching: false,
        value: convertValue(this.props.value, this.props.keyIndex, this.props.labelMap),
        data: [],
        copied: false,
        copyTooltipVisible: false
    }
    onQuery = value => {
        // 确保正确的fetch 顺序
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.props.onSearch(value).then(data => {
            if(fetchId !== this.lastFetchId) {
                this.setState({
                    isFetching: false
                });
                return;
            }
            this.setState({
                isFetching: false,
                data: data || []
            });
        });
    }
    onSearch = value => {
        this.setState({
            isFetching: true,
            data: []
        });
        this.onQuery(value);
    }
    onSelect = value => {
        const key = this.props.keyIndex;
        /*eslint-disable eqeqeq */
        const data = this.state.data.find(d => d[key] == value.key);
        this.setState({
            value,
            data: []
        });
        this.props.onSelect(data);
    }
    onChange = value => {
        if(value) {
            const key = this.props.keyIndex;
            /*eslint-disable eqeqeq */
            const data = this.state.data.find(d => d[key] == value.key);
            if(data)
                value.label = this.props.labelMap(data);
            this.setState({
                value,
                isFetching: false,
                data: []
            });
            if(this.props.onChange)
                this.props.onChange(value);
        } else { // 清空时
            this.setState({
                value,
                isFetching: false,
                data: []
            });
            if(this.props.onChange)
                this.props.onChange(value);
            if(this.props.onSelect)
                this.props.onSelect({});
        }
    }
    onFocus = () => {
        if(this.props.searchOnFocus)
            this.onSearch();
    }
    onBlur = () => {
        this.setState({
            value: convertValue(this.props.value, this.props.keyIndex, this.props.labelMap),
            data: []
        });
        if(this.props.onBlur)
            this.props.onBlur();
    }
    onClickCopyBtn = () => {
        const textField = document.createElement('textarea');
        textField.innerText = this.props.value ? this.props.labelMap(this.props.value) : ' ';
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        this.setState({copied: true});
    }
    onCopyTooltipVisibleChange = visible => {
        if(visible) {
            this.setState({
                copyTooltipVisible: visible,
                copied: false,
            });
            return;
        }
        this.setState({
            copyTooltipVisible: visible,
        });
    }
    render() {
        const {onClickSearchBtn, placeholder, dropdownMatchSelectWidth, allowClear} = this.props;
        const {value, isFetching, data} = this.state;
        const dataOptions = data.map(d => ({
            text: this.props.labelMap(d),
            value: d[this.props.keyIndex]
        }));
        const selectClass = classnames({
            [styles.select1]: !this.props.showCopyButton,
            [styles.select2]: this.props.showCopyButton
        });
        const btnClass = classnames({
            [styles.btn]: true,
        });
        return (
            <InputGroup compact>
                <Select
                    className={selectClass}
                    allowClear={allowClear}
                    showSearch
                    labelInValue
                    value={value}
                    placeholder={placeholder || this.props.intl.formatMessage({
                        id: 'COMMON_SEARCHSELECT_PLACEHOLDER',
                        defaultMessage: '请输入查询'
                    })}
                    dropdownMatchSelectWidth={dropdownMatchSelectWidth}
                    notFoundContent={isFetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.onSearch}
                    onSelect={this.onSelect}
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    dropdownRender={this.props.dropdownRender}
                    onBlur={this.onBlur}>
                    {
                        dataOptions.map(o => (
                            <Option key={o.value} value={o.value}>{o.text}</Option>
                        ))
                    }
                </Select>
                {
                    this.props.showCopyButton &&
                    <Tooltip visible={this.state.copyTooltipVisible}
                        onVisibleChange={this.onCopyTooltipVisibleChange}
                        title={
                            this.state.copied ?
                            this.props.intl.formatMessage({
                                id:'COMMON_COPY_WRAPPER_COPIED',
                                defaultMessage: '已复制'
                            }) :
                            this.props.intl.formatMessage({
                                id:'COMMON_COPY_WRAPPER_COPY',
                                defaultMessage: '复制'
                            })
                          }>
                        <Button className={btnClass} onClick={this.onClickCopyBtn}>
                            <Icon type={(this.state.copied && this.state.copyTooltipVisible) ? 'check' : 'copy'}/>
                        </Button>
                    </Tooltip>
                }
                <Button
                    className={btnClass}
                    onClick={onClickSearchBtn}>
                    <Icon type="search" />
                </Button>
            </InputGroup>
        );
    }
}

SearchSelect.propTypes = {
    /**
     * eg: labelMap: d => `${d.name}_${d.code}`
     */
    labelMap: PropTypes.func.isRequired,
    /**
     * 点击查询按钮时的回调函数
     */
    onClickSearchBtn: PropTypes.func.isRequired,
    /**
     * @param {string} inputValue 输入的查询条件
     * @returns {Array} data 异步请求返回的数据
     */
    onSearch: PropTypes.func.isRequired,
    /**
     * @param {object} data 选中项对应的数据
     */
    onSelect: PropTypes.func.isRequired,
    // 是否允许清空，默认false
    allowClear: PropTypes.bool,
    /** 延时多少毫秒 查询 */
    delay: PropTypes.number,
    /**
     * 下拉菜单和选择器同宽 默认 false
     */
    dropdownMatchSelectWidth: PropTypes.bool,
    dropdownRender: PropTypes.func,
    /**
     * 默认为id
     */
    keyIndex: PropTypes.string,
    placeholder: PropTypes.string,
    // 获取焦点时是否查询数据 默认 true
    searchOnFocus: PropTypes.bool,
    // 是否显示copy 按钮
    showCopyButton: PropTypes.bool,
    /**
     * 结构和异步请求返回的数据的保持一致
     */
    value: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
};

SearchSelect.defaultProps = {
    keyIndex: 'id',
    delay: 300,
    dropdownMatchSelectWidth: false,
    searchOnFocus: true,
    showCopyButton: false,
    allowClear: false
};

export default injectIntl(SearchSelect);
