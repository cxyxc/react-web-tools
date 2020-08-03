import React from 'react';
import {localize, FormattedMessage, language} from './localize';
import PropTypes from 'prop-types';
import {Upload, message, Card, Button, Alert, Steps, Icon} from 'antd';
import {FILES_API} from '../constants';
import {messageFormat} from '../utils';
const Step = Steps.Step;
const basePath = fetch.basePath || '';
import {handleAuthenticate} from 'Shared/utils/externalAuthenticationManager';

const getTemplateName = path => path.replace(/^.*[\\/]/, '').split('.')[0];
const normalizedLanguages = {'zh-CN': 'zh-Hans,zh-CN'};
const IMPORT_HEADERS = Object.freeze({'Accept-Language': normalizedLanguages[language] || language});

class ExcelImport extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            message: null,
        };
    }

    componentWillUnmount() {
        this.unmount = true;
    }

    handleChange = ({file}) => {
        // beforeUpload 返回 false 或者 Promise.reject 时，file.status 为 undefined
        if(!file.status || file.status === 'removed')
            return;

        if(file.status === 'uploading') {
            this.setState({
                loading: true,
                message: null
            });
            return;
        }

        this.setState({loading: false});

        const success = file.status === 'done';

        if(!success && file.error && file.error.status === 401)
            handleAuthenticate();

        if(typeof this.props.afterUpload === 'function')
            if(this.props.afterUpload({
                ok: success,
                response: file.response
            }) || this.unmount)
                return;

        const msg = messageFormat(success ? 200 : file.error.status || 'error', this.props.intl.formatMessage({
            id: 'excelImport.import',
            defaultMessage: '导入'
        }), (file.response && file.response.message) || file.response);
        msg.fileId = file.response && file.response.payload;

        this.setState({
            success,
            message: msg
        });
    };

    handleBeforeUpload = file => {
        if(this.props.limitMegabyte > 0 && this.props.limitMegabyte <= (file.size / 1024 / 1024)) {
            message.error(this.props.intl.formatMessage({
                id: 'excelImport.error.limitMegabyte',
                defaultMessage: '文件大小不能超过 {limitMegabyte}M。',
                values: {limitMegabyte: this.props.limitMegabyte}
            }));
            return false;
        }
        if(typeof this.props.beforeUpload === 'function')
            return this.props.beforeUpload(file);
        return true;
    };

    handleClick = e => {
        if(typeof this.props.importClick === 'function')
            this.props.importClick(e);
    };

    render() {
        let headers = IMPORT_HEADERS;
        if(this.props.headers)
            if(typeof this.props.headers === 'function')
                headers = this.props.headers(IMPORT_HEADERS);
            else if(typeof this.props.headers === 'object')
                headers = this.props.headers;

        const importButton = (
            <Upload
                action={this.props.action}
                disabled={this.props.disabled}
                showUploadList={false}
                headers={headers}
                data={this.props.data}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                beforeUpload={this.handleBeforeUpload}
                onChange={this.handleChange}>
                <Button type="primary" loading={this.state.loading} disabled={this.props.disabled} onClick={this.handleClick}>
                    {this.props.intl.formatMessage({
                        id: 'excelImport.btn.import',
                        defaultMessage: '导入Excel'
                    })}
                </Button>
            </Upload>
        );

        let alter = null;
        if(!this.state.loading && this.state.message) {
            const {title, content, fileId} = this.state.message;
            if(this.state.success)
                alter = <Alert message={title} type="success"/>;
            else
                alter = (<Alert
                    message={title}
                    type="error"
                    description={fileId
                        ? <FormattedMessage
                            id="excelImport.error.desc"
                            defaultMessage="上传的文件内容不符合要求，下载{errorFile}，编辑以后，可再次执行导入操作"
                            values={{
                                errorFile: <a key="export" href={`${basePath}${FILES_API.files}/${encodeURIComponent(fileId)}`}>
                                    {this.props.intl.formatMessage({
                                        id: 'excelImport.error.file',
                                        defaultMessage: '错误文件'
                                    })}
                                </a>
                            }}/>
                        : content}/>);
        }

        return (
            <Card>
                <Steps direction="vertical" size="large">
                    {this.props.template && <Step
                        title={this.props.intl.formatMessage({
                            id: 'excelImport.step1.title',
                            defaultMessage: '下载模板'
                        })}
                        status="process"
                        icon={<Icon type="download" />}
                        description={<FormattedMessage
                            id="excelImport.step1.description"
                            tagName="p"
                            defaultMessage="点击 {template} 链接，下载{templateName}"
                            values={{
                                template: <a key="export" href={this.props.template}>{this.props.intl.formatMessage({
                                    id: 'excelImport.downloadTemplate',
                                    defaultMessage: '下载模板'
                                })}</a>,
                                templateName: this.props.templateName || getTemplateName(this.props.template) || this.props.intl.formatMessage({
                                    id: 'excelImport.template',
                                    defaultMessage: '模板'
                                })}}/>} />}
                    <Step
                        title={this.props.intl.formatMessage({
                            id: 'excelImport.step2.title',
                            defaultMessage: '填写数据'
                        })}
                        status="process"
                        icon={<Icon type="edit" />}
                        description={<div>
                            {this.props.description.map((item, index) => <p key={index}>{item}</p>)}
                            {this.props.limitMegabyte > 0
                                ? <FormattedMessage
                                    id="excelImport.step2.description1"
                                    tagName="p"
                                    defaultMessage="只能导入 xlsx 格式文件，文件最大支持 {limitMegabyte}M；"
                                    values={{limitMegabyte: this.props.limitMegabyte}}/>
                                : this.props.intl.formatMessage({id: 'excelImport.step2.description2',
                                    defaultMessage: '只能导入 xlsx 格式文件；'})}
                        </div>} />
                    {this.props.otherSteps}
                    <Step
                        title={this.props.intl.formatMessage({
                            id: 'excelImport.step3.title',
                            defaultMessage: '上传文件'
                        })}
                        status="process"
                        icon={<Icon type="upload" />}
                        description={<FormattedMessage
                            id="excelImport.step3.description"
                            defaultMessage="点击 {importButton} 上传数据"
                            values={{importButton}}/>} />
                </Steps>
                {alter}
            </Card>
        );
    }
}

ExcelImport.propTypes = {
    disabled: PropTypes.bool,
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    headers: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    template: PropTypes.string,
    templateName: PropTypes.string,
    limitMegabyte: PropTypes.number,
    description: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node])),
    otherSteps: PropTypes.arrayOf(PropTypes.node),
    intl: PropTypes.object,
    importClick: PropTypes.func,
    beforeUpload: PropTypes.func,
    afterUpload: PropTypes.func
};

const EMPTY_ARRAY = [];

ExcelImport.defaultProps = {
    limitMegabyte: 5,
    disabled: false,
    description: EMPTY_ARRAY,
    otherSteps: EMPTY_ARRAY
};

export default localize(ExcelImport);
