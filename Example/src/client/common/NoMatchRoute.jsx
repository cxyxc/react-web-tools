import React from 'react';
import PropTypes from 'prop-types';
import {Route, Link} from 'react-router-dom';
import Exception from 'ant-design-pro/lib/Exception';
import {Button} from 'antd';

class NoMatchRoute extends React.PureComponent {
    render() {
        return (
            <Route render={() =>
                <Exception type="404" actions={<Button type="primary"><Link to={this.props.link}>{this.props.title}</Link></Button>} />} />
        );
    }
}

/**
 * @link 跳转链接
 * @title 按钮名称
 */
NoMatchRoute.propTypes = {
    link: PropTypes.string,
    title: PropTypes.string
};

NoMatchRoute.defaultProps = {
    link: '#/',
    title: '返回首页'
};

export default NoMatchRoute;
