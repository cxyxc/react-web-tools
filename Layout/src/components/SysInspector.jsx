import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {notification, Button} from 'antd';
import cacheManager from '@shsdt/web-shared/lib/utils/cacheManager';
import {reload, clear} from '@shsdt/web-shared/lib/actions/store';

class SysInspector extends Component {
    componentDidMount = () => {
        const stateKey = this.stateKey();
        if(stateKey)
            cacheManager.getStateCache(stateKey).then(cacheState => {
                // 检测当前页（和当前用户）是否存在缓存的 redux state
                if(cacheState) {
                    this.key = `open${Date.now()}`;
                    const btn = (
                        <div>
                            <Button onClick={this.handleOk}>{this.props.intl.formatMessage({
                                id: 'SHELL_SYSINSPECTOR_YES',
                                defaultMessage: '是'
                            })}</Button>
                            <Button style={{marginLeft: 5}} onClick={this.handleCancel}>{this.props.intl.formatMessage({
                                id: 'SHELL_SYSINSPECTOR_NO',
                                defaultMessage: '否'
                            })}</Button>
                        </div>
                    );
                    const config = {
                        message: this.props.intl.formatMessage({
                            id: 'SHELL_SYSINSPECTOR_NOTIFICATION',
                            defaultMessage: '否'
                        }),
                        description: this.props.intl.formatMessage({
                            id: 'SHELL_SYSINSPECTOR_DESCRIPTION',
                            defaultMessage: '存在历史记录，是否恢复？'
                        }),
                        btn,
                        key: this.key,
                        duration: 0,
                        onClose: () => this.handleCancel('onClose')
                    };
                        // 存在缓存，弹出提示询问是否使用
                    notification.info(config);
                    this.cacheState = cacheState;
                }
            });
    }

    cacheState = {}
    key = ''
    stateKey = () => {
        if(this.props.username)
            return `${this.props.username}-${window.location.href}`;
        return '';
    }

    // 使用缓存
    handleOk = () => {
        if(this.cacheState)
            this.props.reloadStore(this.cacheState);
        notification.close(this.key);
    }

    // 不使用缓存
    handleCancel = type => {
        this.setState({
            visible: false,
        });
        this.props.cleanRecord();
        if(type !== 'onClose')
            notification.close(this.key);
    }

    render() {
        return (
            null
        );
    }
}

SysInspector.propTypes = {
    cleanRecord: PropTypes.func,
    intl: PropTypes.object,
    reloadStore: PropTypes.func,
    username: PropTypes.string
};

import {connect} from '@shsdt/web-shared/lib/utils/connectExtended';
import {injectIntl} from '../intl';

export default connect(null, dispatch => ({
    reloadStore: data => dispatch(reload(data)),
    cleanRecord: () => dispatch(clear())
}))(injectIntl(SysInspector));
