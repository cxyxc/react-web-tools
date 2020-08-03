import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Breadcrumb as AntdBreadcrumb} from 'antd';
import classNames from 'classnames';
import './page-bar.css';
import './breadcrumb.css';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import routeManager from '@shsdt/web-shared/lib/utils/routeManager';

// 根据数组生成面包屑方法
const renderBreadcrumb = (breadcrumbs, menuPathLength, formatMessage) => {
    const BreadcrumbItems = [];

    // Home
    BreadcrumbItems.push(
        <AntdBreadcrumb.Item key="home">
            <a href="/">{formatMessage({
                id: 'SHELL_HOME',
                defaultMessage: '首页'
            })}</a>
        </AntdBreadcrumb.Item>
    );

    breadcrumbs.forEach((item, key) => {
        if(item.title)
            if(key < breadcrumbs.length - 1 && item.url) {
                const url = item.url.replace('#', '').replace(/\/+/g, '/');
                BreadcrumbItems.push(
                    <AntdBreadcrumb.Item key={`${item.title}${key}`}>
                        <Link to={url}><span>{item.title}</span></Link>
                    </AntdBreadcrumb.Item>
                );
            } else
                BreadcrumbItems.push(
                    <AntdBreadcrumb.Item key={key}>
                        <span>{item.title}</span>
                    </AntdBreadcrumb.Item>
                );
        else if(typeof item === 'string')
            BreadcrumbItems.push(
                <AntdBreadcrumb.Item key={key}>
                    <span>{item}</span>
                </AntdBreadcrumb.Item>
            );
    });
    return BreadcrumbItems;
};

const Breadcrumb = props => {
    const namespace = props.match.path;
    const location = {
        ...props.location,
        pathname: props.location.pathname
    };
    const extraBreadcrumbs = props.items || routeManager.getPagePath({
        namespace,
        location
    });
    const breadcrumbs = _.union(props.menuPath, extraBreadcrumbs);
    const BreadcrumbItems = renderBreadcrumb(breadcrumbs, props.menuPath.length, props.intl.formatMessage);

    return (
        <div className={classNames('pagebar-container')}>
            <AntdBreadcrumb>
                {BreadcrumbItems}
            </AntdBreadcrumb>
        </div>
    );
};

Breadcrumb.propTypes = {
    intl: PropTypes.object,
    /**
     * 指定面包屑内容，非必需，默认按照 location 构建
     * title: 显示文本
     * url: 链接地址
     * eg. [{title: 跟踪处理, url: /75/follow}]
     */
    items: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string
    })),
    /**
     * react-router, location, 非必需，默认为window.location
     * 路由切换时，确保重新render
     */
    location: PropTypes.object,
    match: PropTypes.object,
    menuPath: PropTypes.array,
    namespace: PropTypes.string,
    rtl: PropTypes.bool,
};

import {connect} from '@shsdt/web-shared/lib/utils/connectExtended';
import {createSelector} from 'reselect';
import {injectIntl} from '../intl';

const EMPTY_ARRAY = [];

export const menuPathSelector = createSelector(
    state => state.getIn(['shell', 'ui', 'menuPath']),
    menuPath => (menuPath && menuPath.toJS()) || EMPTY_ARRAY
);

const mapStateToProps = state => ({
    menuPath: menuPathSelector(state),
});

export default withRouter(connect(mapStateToProps)(injectIntl(Breadcrumb)));
