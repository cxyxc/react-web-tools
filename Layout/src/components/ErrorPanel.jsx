import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Button, Card} from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
import errorImg from '../../assets/img/error.png';
import styles from './ErrorPanel.css';

class ErrorPanel extends PureComponent {
    state = {
        showDetailPanel: false
    };

    reload() {
        window.location.reload();
    }

    toggle = () => {
        const showDetailPanel = this.state.showDetailPanel;
        this.setState({
            showDetailPanel: !showDetailPanel
        });
    }

    copy = () => {
        if(this.textarea && document.execCommand) {
            this.textarea.select();
            document.execCommand('copy', false, null);
        }
    }
    render() {
        const content = (
            <div>
                <div className={styles.desc} dangerouslySetInnerHTML={{
                    __html: `${this.props.error && this.props.error.stack.replace(/[\r\n]/g, '<br/>').replace(/ /g, '&nbsp;')}`
                }}>
                </div>
                <textarea
                    ref={textarea => (this.textarea = textarea)}
                    value={this.props.error.stack}
                    readOnly
                    className={styles.textarea}/>
            </div>
        );
        const actions = (
            <div>
                <Button type="primary" onClick={this.reload}>{this.props.intl.formatMessage({
                    id: 'SHELL_RELOAD',
                    defaultMessage: '重新加载'
                })}</Button>
                <Button onClick={this.toggle}>{this.props.intl.formatMessage({
                    id: 'SHELL_ERRORPANEL_DETAIL',
                    defaultMessage: '详情'
                })}</Button>
            </div>
        );
        return (<div className={styles.container} ref={container => (this.container = container)}>
            <Exception
                title={<div className={styles.title}>{this.props.intl.formatMessage({
                    id: 'SHELL_ERRORPANEL_ERROR',
                    defaultMessage: '抱歉，页面出错了'
                })}</div>}
                img={errorImg}
                desc={<div></div>}
                actions={actions}/>
            {
                this.state.showDetailPanel
                    ? (
                        <div className={styles.detail}>
                            <Card title={this.props.intl.formatMessage({
                                id: 'SHELL_ERRORPANEL_MESSAGE',
                                defaultMessage: '错误详情'
                            })}
                            extra={<a href="javascript:;" onClick={this.copy} style={{float: 'right'}}>{
                                this.props.intl.formatMessage({
                                    id: 'SHELL_ERRORPANEL_COPY',
                                    defaultMessage: '复制'
                                })}</a>}>
                                {content}
                            </Card>
                        </div>
                    ) : null
            }
        </div>);
    }
}

ErrorPanel.propTypes = {
    componentStack: PropTypes.string,
    error: PropTypes.object,
    intl: PropTypes.object
};

import {injectIntl} from '../intl';

export default injectIntl(ErrorPanel);
