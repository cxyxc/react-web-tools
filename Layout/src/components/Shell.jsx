import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/zh-cn';

import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {Spin, LocaleProvider as AntLocaleProvider, notification, Layout as AntLayout, Button} from 'antd';
import ErrorBoundary from 'react-error-boundary';
import NoMatchRoute from './NoMatchRoute';
import {getRoutes} from '../utils/getRoutes';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import SidebarMenu from './SidebarMenu';
import ErrorPanel from './ErrorPanel';
import SysInspector from './SysInspector';
import classNames from 'classnames';
import fetchPolyfill from '@shsdt/web-shared/lib/utils/fetch-polyfill';
import {getCurrentUserInfo} from '@shsdt/web-shared/lib/actions/currentUserContext';
import 'ant-design-pro/dist/ant-design-pro.css';
import './shell.css';

import 'intl';
import 'intl/locale-data/jsonp/en.js';
import 'intl/locale-data/jsonp/zh.js';
import 'intl/locale-data/jsonp/ja.js';

const {Header, Sider, Content} = AntLayout;

const sentryHandler = (error, componentStack) => {
    if(self.Sentry)
        self.Sentry.withScope(scope => {
            scope.setExtra('componentStack', componentStack);
            self.Sentry.captureException(error);
        });
};
const PageFallbackComponent = ({componentStack, error}) => (
    <ErrorPanel componentStack={componentStack} error={error}/>
);
PageFallbackComponent.propTypes = {
    componentStack: PropTypes.string,
    error: PropTypes.object,
};
const RoutePages = shellProps => {
    const {match, routerData} = shellProps;
    const routes = getRoutes(match.path, routerData);
    const indexPath = '/home';
    return (<Switch>
        {
            routes.map(item => (<Route
                key={item.key}
                path={item.path}
                render={props => <ErrorBoundary FallbackComponent={PageFallbackComponent} onError={sentryHandler}>
                    <item.component {...props} setShellHide={shellProps.setShellHide}/>
                </ErrorBoundary>}/>))
        }
        <Redirect from="/" to={indexPath} exact strict />
        <Route render={() => <NoMatchRoute link={indexPath} />} />
    </Switch>);
};
RoutePages.propTypes = {
    match: PropTypes.object,
    routerData: PropTypes.object,
    setShellHide: PropTypes.func
};

class Shell extends React.PureComponent {
    // 设置第三方库的Locale
    static setLibraryLocale(language) {
        const normalizedLanguages = {'zh-CN': 'zh-Hans,zh-CN'};
        fetchPolyfill.setOptions({
            headers: {
                'Accept-Language': normalizedLanguages[language] || language
            }
        });
    }

    static getAntdLocale(language) {
        let options = require('antd/lib/locale-provider/zh_CN');
        switch(language) {
            case 'ar':
                options = require('antd/lib/locale-provider/ar_EG');
                break;
            case 'ja-JP':
                options = require('antd/lib/locale-provider/ja_JP');
                break;
            case 'en-US':
                options = require('antd/lib/locale-provider/en_US');
                break;
            case 'pt-PT':
                options = require('antd/lib/locale-provider/pt_PT');
                break;
            default: {
                options = require('antd/lib/locale-provider/zh_CN');
                const locale = options.locale || options.default.locale;
                // 此处使用 antd 语言包内的 locale 来进行 moment 的语言包设置
                // 避免 antd 内使用该 locale 显式进行时间格式化时
                // 语言标识不一致引发语言包不一致
                moment.updateLocale(locale, {
                    // 重写中文环境下的日期格式
                    longDateFormat: {
                        LT: 'HH:mm',
                        LTS: 'HH:mm:ss',
                        L: 'YYYY/MM/DD',
                        LL: 'YYYY/MM/DD',
                        LLL: 'YYYY/MM/DD HH:mm',
                        LLLL: 'YYYY年MM月DD日 HH:mm',
                    }
                });
            }
        }
        // TODO: 待 antd 升级后移除兼容
        return options.default || options;
    }
    
    constructor(props) {
        super(props);
        this.HeadReloadComponent = this.RealodButton.bind(this, 'headerComponentKey');
        this.SidebarReloadComponent = this.RealodButton.bind(this, 'sidebarMenuKey');
    }
    
    state = {
        userInfo: null,
        headerComponentKey: 0,
        sidebarMenuKey: 0,
        hide: false // 控制 Shell 隐藏/显示
    }

    componentDidMount() {
        Shell.setLibraryLocale(this.props.intl.language);
        this.props.init();
        notification.config({
            top: 16,
            placement: this.props.intl.rtl ? 'topLeft' : 'topRight'
        });
        getCurrentUserInfo().then(res => {
            if(res.data)
                this.setState({
                    userInfo: res.data
                });
        });
    }

    componentDidUpdate() {
        const beforeUnloadFunc = e => {
            const message = this.props.changed === true ? this.props.intl.formatMessage({
                id: 'SHELL_UNLOAD_PROMPT',
                defaultMessage: '您的数据已修改，确定要离开吗？'
            }) : this.props.changed;
            e = e || window.event;
            if(e)
                e.returnValue = message;
            return message;
        };
        if(this.props.changed === false)
            window.removeEventListener('beforeunload', beforeUnloadFunc);
        else
            window.addEventListener('beforeunload', beforeUnloadFunc);
    }

    reload = e => this.setState({[e.target.dataset.id]: this.state[e.target.dataset.id] + 1});

    RealodButton(id) {
        return (<div className="shell-reload-button">
            <Button ghost onClick={this.reload} data-id={id}>{this.props.intl.formatMessage({
                id: 'SHELL_RELOAD',
                defaultMessage: '重新加载'
            })}</Button>
        </div>);
    }

    setHide = hide => {
        this.setState({
            hide
        });
    }

    render() {
        const {userInfo, hide} = this.state;
        const {
            routerData,
        } = this.props;

        return (
            <ErrorBoundary FallbackComponent={PageFallbackComponent} onError={sentryHandler}>
                <Router>
                    <div id="root" className={hide ? 'shell-hide' : null}>
                        <AntLocaleProvider locale={Shell.getAntdLocale(this.props.intl.language)}>
                            <Spin spinning={this.props.isBusy} tip={this.props.intl.formatMessage({
                                id: 'SHELL_LOADING',
                                defaultMessage: '请稍候……'
                            })}>
                                <AntLayout>
                                    <Sider
                                        className="sider"
                                        trigger={null}
                                        collapsible
                                        collapsed={!this.props.isSidebarExpanded}>
                                        <ErrorBoundary key={this.state.sidebarMenuKey} FallbackComponent={this.SidebarReloadComponent} onError={sentryHandler}>
                                            <Route path="/" render={props => <SidebarMenu location={props.location} />} />
                                        </ErrorBoundary>
                                    </Sider>
                                    <Content className={classNames('content', {'content-sider-collapsed': !this.props.isSidebarExpanded})}>
                                        <AntLayout>
                                            <Header className="header">
                                                <ErrorBoundary key={this.state.headerComponentKey} FallbackComponent={this.HeadReloadComponent} onError={sentryHandler}>
                                                    <PageHeader topMenu={this.props.topMenu} />
                                                </ErrorBoundary>
                                            </Header>
                                            <div className="content-page">
                                                <Route path="/" render={props =>
                                                    <RoutePages {...props} routerData={routerData} setShellHide={this.setHide} />}/>
                                            </div>
                                        </AntLayout>
                                        <PageFooter copyright={this.props.copyright} />
                                    </Content>
                                </AntLayout>
                                {
                                    userInfo && <SysInspector username={userInfo.username} />
                                }
                            </Spin>
                        </AntLocaleProvider>
                    </div>
                </Router>
            </ErrorBoundary>
        );
    }
}

Shell.propTypes = {
    changed: PropTypes.bool,
    copyright: PropTypes.string,
    hide: PropTypes.bool, // 控制 shell 显示隐藏（仅在多页面情况下使用）
    init: PropTypes.func,
    intl: PropTypes.object,
    isBusy: PropTypes.bool,
    isSidebarExpanded: PropTypes.bool,
    page: PropTypes.object,
    routerData: PropTypes.object,
    topMenu: PropTypes.array,
};

Shell.defaultProps = {
    isBusy: false,
    changed: false,
    isSidebarExpanded: false,
    isLogined: false,
    hide: false
};

import {connect} from '@shsdt/web-shared/lib/utils/connectExtended';
import {shellInitBegin} from '@shsdt/web-shared/lib/actions/shell';
import {injectIntl} from '../intl';

const mapStateToProps = state => {
    const changed = state.getIn(['shell', 'ui', 'changed']);
    return {
        isBusy: state.getIn(['shell', 'ui', 'isBusy']),
        changed: (changed === true || typeof changed === 'string') && changed,
        copyright: state.getIn(['shell', 'ui', 'copyright']) || '',
        isSidebarExpanded: state.getIn(['shell', 'ui', 'isSidebarExpanded']) && true,
    };
};

const mapDispatchToProps = dispatch => ({
    init: () => dispatch(shellInitBegin())
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Shell));
