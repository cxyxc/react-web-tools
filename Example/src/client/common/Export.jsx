import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import {connect as connectShell} from '@shsdt/web-shared/lib/utils/connectExtended';
import {shellSetBusy} from '@shsdt/web-shared/lib/actions/shell';
import {FILES_API} from '../constants';
import {formatMessage} from './localize';

/*eslint-disable  react/prefer-stateless-function*/
class Export extends PureComponent {
    /**
     * 文件下载
     * @param {*} id 文件id/文件名
     */
    download = id => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = `${FILES_API.files}/${encodeURI(id)}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    onClickExportBtn = () => {
        const {shellSetBusy} = this.props;
        const exportPromise = this.props.exportRequest();
        if(typeof exportPromise !== 'object' || !('then' in exportPromise)) return; // 若未返回 Promise 则终止
        shellSetBusy('export', true);
        exportPromise.then(id => {
            shellSetBusy('export', false);
            if(typeof id !== 'string') return; /// 若 id 不是 string 类型则终止
            this.download(id);
        });
    }

    render() {
        const {shellSetBusy, exportRequest, ...others} = this.props;

        return (
            <Button onClick={this.onClickExportBtn} {...others}>{formatMessage({
                id: 'button.export',
                defaultMessage: '导出'
            })}</Button>
        );
    }
}

Export.propTypes = {
    exportRequest: PropTypes.func,
    shellSetBusy: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
    shellSetBusy: (name, isBusy) => dispatch(shellSetBusy(name, isBusy))
});

export default connectShell(null, mapDispatchToProps)(Export);
