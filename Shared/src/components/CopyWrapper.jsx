import React from 'react';
import PropTypes from 'prop-types';
import {Tooltip, Icon} from 'antd';
import {injectIntl} from '../localizations/intl';

export class CopyWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tip: (this.props.tooltip && this.props.tooltip.title) || this.props.intl.formatMessage({
                id: 'COMMON_COPY_WRAPPER_COPY',
                defaultMessage: '复制'
            })
        };
        this.onClick = this.onClick.bind(this);
        this.onVisibleChange = this.onVisibleChange.bind(this);
    }

    onClick() {
        const textField = document.createElement('textarea');
        textField.innerText = this.props.text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        this.setState({tip: this.props.copiedTip || this.props.intl.formatMessage({
            id: 'COMMON_COPY_WRAPPER_COPIED',
            defaultMessage: '已复制'
        })});
    }

    onVisibleChange(visable) {
        if(visable)
            this.setState({tip: 
                (this.props.tooltip && this.props.tooltip.title) ||
                this.props.intl.formatMessage({
                    id:'COMMON_COPY_WRAPPER_COPY',
                    defaultMessage: '复制'
                })
            });
        if(this.props.tooltip && typeof this.props.tooltip.onVisibleChange === 'function')
            this.props.tooltip.onVisibleChange(visable);
    }

    render() {
        const {title, onVisibleChange, ...tooltip} = this.props.tooltip;
        return (
            <Tooltip title={this.state.tip} {...tooltip} onVisibleChange={this.onVisibleChange}>
                <Icon className={this.props.overlayClassName} type="copy" onClick={this.onClick}/>
            </Tooltip>
        );
    }
}

CopyWrapper.propTypes = {
    /** 待复制的文本 */
    text: PropTypes.string.isRequired,
    /** 复制成功提示信息 */
    copiedTip: PropTypes.string,
    /** 复制标签类名 */
    overlayClassName: PropTypes.string,
    /** Tooltip 相关配置，参见 antd*/
    tooltip: PropTypes.object,
    intl: PropTypes.object
};

CopyWrapper.defaultProps = {
    tooltip: {
        placement: 'bottom'
    }
};

export default injectIntl(CopyWrapper);
