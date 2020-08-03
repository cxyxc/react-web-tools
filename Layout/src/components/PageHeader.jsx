import React from 'react';
import PropTypes from 'prop-types';
import {connect} from '@shsdt/web-shared/lib/utils/connectExtended';
import {Icon} from 'antd';

import './page-header.css';

class PageHeader extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleSidebarTogglerClick = this.handleSidebarTogglerClick.bind(this);
    }

    handleSidebarTogglerClick() {
        this.props.shellSetSidebar({
            isExpanded: !this.props.isSidebarExpanded
        });
    }

    render() {
        return (
            <div>
                <Icon
                    style={{left: this.props.isSidebarExpanded ? 200 : 20}}
                    className="trigger"
                    type={this.props.isSidebarExpanded ? 'menu-fold' : 'menu-unfold'}
                    onClick={this.handleSidebarTogglerClick} />
                <div className="topMenu">
                    {this.props.topMenu}
                </div>
            </div>
        );
    }
}

PageHeader.propTypes = {
    basePath: PropTypes.string,
    isSidebarExpanded: PropTypes.bool,
    logout: PropTypes.func,
    shellSetSidebar: PropTypes.func,
    topMenu: PropTypes.array,
};

import {shellSetSidebar, logout} from '@shsdt/web-shared/lib/actions/shell';

export default connect(state => ({
    basePath: state.getIn(['shell', 'ui', 'basePath']) || '',
    isSidebarExpanded: (state.getIn(['shell', 'ui', 'isSidebarExpanded']) && true) || false
}), dispatch => ({
    shellSetSidebar: options => dispatch(shellSetSidebar(options)),
    logout: () => dispatch(logout())
}))(PageHeader);
