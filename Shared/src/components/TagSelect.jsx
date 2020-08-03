import React, {PureComponent, createRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Tag, Icon} from 'antd';
import {injectIntl} from '../localizations/intl';
import styles from './TagSelect.css';
import throttle from 'lodash/throttle';

const {CheckableTag} = Tag;

const TagSelectOption = ({children, checked, onChange, value}) => (
    <CheckableTag
        checked={checked}
        key={value}
        onChange={state => onChange(value, state)}>
        {children}
    </CheckableTag>
);

TagSelectOption.propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.any,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func
};

export class TagSelect extends PureComponent {
    state = {
        expand: false,
        expandable: false
    }

    tagSelectRef = createRef();

    componentDidMount() {
        if(this.props.expandable) {
            var current = this.tagSelectRef.current;
            var expandable = false;
            if(current.scrollHeight > current.clientHeight) 
                expandable = true;
            else 
                expandable = false;
            if(!this.state.expand)
                this.setState({
                    expandable
                })
            window.addEventListener("resize", this.handleWindowResize)
        }
    }
    componentDidUpdate(prevProps) {
        if(this.props.expandable && (prevProps.options !== this.props.options)) {
            this.handleWindowResize();
        }
    }
    componentWillUnmount() {
        if(this.props.expandable)
            window.removeEventListener("resize", this.handleWindowResize)
    }

    handleWindowResize = throttle(() => {
        var current = this.tagSelectRef.current;
        var expandable = false;
        if(current.scrollHeight > current.clientHeight) 
            expandable = true;
        else 
            expandable = false;
        if(!this.state.expand)
            this.setState({
                expandable
            })
    },  500)

    handleTagChange = (value, checked) => {
        const checkedTags = [...this.props.value];

        const index = checkedTags.indexOf(value);
        if(checked && index === -1)
            checkedTags.push(value);
        else if(!checked && index > -1)
            checkedTags.splice(index, 1);

        this.onChange(checkedTags);
    }

    handleExpand = () => {
        this.setState({
            expand: !this.state.expand,
        });
    }
    onChange = value => {
        this.props.onChange(value, this.props.name);
    }

    onSelectAll = checked => {
        let checkedTags = [];
        if(checked)
            checkedTags = this.props.options.map(op => op.value);

        this.onChange(checkedTags);
    }

    render() {
        const {expand} = this.state;
        const {value, options, expandable, showSelectAll} = this.props;
        const tagOptions = options.map(op =>
            <TagSelectOption
                key={op.value}
                value={op.value}
                checked={value.indexOf(op.value) > -1}
                onChange={this.handleTagChange} >
                {op.text}
            </TagSelectOption>
        );
        const checkedAll = options.length === value.length;
        const cls = classNames({
            [styles.tagSelect]: expandable && !expand,
            [styles.hasExpandTag]: expandable && this.state.expandable,
            [styles.expanded]: expand,
        });
        return (
            <div className={cls} ref={this.tagSelectRef}>
                {
                    showSelectAll &&
                    <CheckableTag
                        checked={checkedAll}
                        key="tag-select-__all__"
                        onChange={this.onSelectAll}>
                        {this.props.intl.formatMessage({
                            id: 'COMMON_TAGSELECT_ALL',
                            defaultMessage: '全部'
                        })}
                    </CheckableTag>
                }
                {tagOptions}
                {
                    expandable && this.state.expandable && (
                        <a className={styles.trigger} onClick={this.handleExpand}>
                            {expand ? this.props.intl.formatMessage({
                                id: 'COMMON_TAGSELECT_COLLAPSE',
                                defaultMessage: '收起'
                            }) : this.props.intl.formatMessage({
                                id: 'COMMON_TAGSELECT_EXPAND',
                                defaultMessage: '更多'
                            })} <Icon type={expand ? 'up' : 'down'} />
                        </a>
                    )
                }
            </div>
        );
    }
}
TagSelect.defaultProps = {
    expandable: false,
    showSelectAll: false
};

TagSelect.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.node,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })).isRequired,
    value: PropTypes.array.isRequired,
    /**
     * @param value
     * @param name
     */
    onChange: PropTypes.func.isRequired,
    //是否显示展开按钮
    expandable: PropTypes.bool,
    //是否显示全选按钮
    showSelectAll: PropTypes.bool,
    intl: PropTypes.object
};

export default injectIntl(TagSelect);
