import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import './sidebar-menu.css';
import './react-perfect-scrollbar.css';
import LogoIconURL from '../../assets/img/logo-icon.png';
import LogoTitleURL from '../../assets/img/logo-title.png';
import {Menu, Icon, Spin} from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {isString} from 'lodash';

const {SubMenu} = Menu;
const isValidString = str => isString(str) && str.trim() !== '';

/**
 * Resolve url to unifrom
 * /a/b/c => /a/b/c/, /#/a/b/c => #a/b/c
 * @param  string
 */
const resolveUrl = url => `/${url.split('/').filter(i => i)
    .join('/')
    .replace(/[/]?#[/]?/, '/#/')}/`;


/**
 * saved menuItemKeyMap {url: menuItemData}
 * {url: {title: string, url: string}}
 */
const menuItemKeyMap = {};

/**
 * Convert pathname to menuPath
 * 通过 pathname 得到面包屑所需的 menuPath
 * /list/search/articles => [{title: string, url: string}, {..}, {..}]
 * @param  pathname
 * @param  menusData
 * @param  menuPath
 */

const resolveMenuPath = (pathname, menusData, menuPath) => {
    for(let i = 0; i < menusData.length; i++) {
        const item = menusData[i];
        if(isValidString(item.url)) {
            const regexp = new RegExp(`${resolveUrl(item.url)}`, 'i');
            if(regexp.test(resolveUrl(pathname))) {
                menuPath.push(item);
                return true;
            }
        }
        
        if(item.items) {
            menuPath.push(item);
            const result = resolveMenuPath(pathname, item.items, menuPath);
            if(result)
                return result;
            menuPath.pop();
        }
    }
    return null;
};

/**
 * Convert menuPath to openKeys
 * @param  menuPath
 */
const getDefaultCollapsedSubMenus = menuPath => {
    if(menuPath.length > 2)
        return menuPath.slice(1, menuPath.length - 1).map(item => item.key);
    return [];
};

// set and saved selectedKeys
let selectedKeys = [];
const getSelectedKeys = menuPath => menuPath.length > 0 ? [menuPath[menuPath.length - 1].url] : [];

/**
 * 根据当前 window.location.pathname 和 Menu item.url
 * 获取菜单路径前缀
 * @param  url
 */
let pathPrefix = '';
const getPathPrefix = url => {
    if(!url) return '';
    const pathnameArray = window.location.pathname.split('/')
        .filter(i => i).reverse();
    let currentPathArray = [];
    const sliceIndex = url.indexOf('#') === -1 ? null : url.indexOf('#');
    currentPathArray = (sliceIndex ? url.slice(0, sliceIndex) : url).split('/')
        .filter(i => i)
        .reverse();
    return pathnameArray.filter((item, index) =>
        currentPathArray[index] !== item)
        .reverse().join('/');
};

// 支持 antd icon name || http 开头 url 地址 || 相对路径
// icon: 'setting',
// icon: 'dcs/sales/demo'
// icon: 'http://demo.com/icon.png'

const getIcon = icon => {
    if(typeof icon === 'string' && icon.indexOf('http') === 0)
        return <img src={icon} alt="icon" className="sidebar-menu-item-img" />;
    
    if(typeof icon === 'string' && (/\//).test(icon))
        return <img src={`/${pathPrefix}/${icon || ''}`.replace(/\/+/g, '/')} alt="icon" className="sidebar-menu-item-img" />;
        
    if(typeof icon === 'string')
        return <Icon type={icon} />;
    
    return icon;
};

const setDocumentTitle = (menuPath = []) => {
    window.document.title = menuPath.map(item => item.title).reverse().join(' - ');
};


// 存放滚动条 ref
let scrollRef = null;

class SidebarMenu extends React.PureComponent {
    static getDerivedStateFromProps(props, state) {
        const pathname = `${window.location.pathname}${window.location.hash}`;
        const handleEffect = menuPath => {
            resolveMenuPath(pathname, props.menus, menuPath);
            selectedKeys = getSelectedKeys(menuPath);
            pathPrefix = getPathPrefix(selectedKeys[0]);
            setDocumentTitle(menuPath);
            props.setMenuPath(menuPath);
        };
        // 监听数据源 menus 变化
        if(props.menus && props.menus.length > 0 && !state.menuRenderFlag) {
            const menuPath = [];
            handleEffect(menuPath);
            return {
                ...state,
                menuRenderFlag: true,
                openKeys: getDefaultCollapsedSubMenus(menuPath),
                prevPropsPathname: pathname
            };
        }
        // 监听前端路由 pathname 变化
        if(state.prevPropsPathname &&
            state.prevPropsPathname !== pathname) {
            const menuPath = [];
            handleEffect(menuPath);

            return {
                ...state,
                openKeys: Array.from(new Set(
                    state.openKeys.concat(getDefaultCollapsedSubMenus(menuPath))
                )),
                prevPropsPathname: pathname
            };
        }
        // 监听 isSidebarExpanded 变化重设 openKeys / scrollRef
        if(state.isSidebarExpanded !== props.isSidebarExpanded) {
            if(props.isSidebarExpanded === false) {
                // 折叠菜单时重置滚动条
                if(scrollRef)
                    scrollRef.scrollTop = 0;
                return {
                    ...state,
                    isSidebarExpanded: props.isSidebarExpanded
                };
            }
            const menuPath = [];
            handleEffect(menuPath);
            return {
                ...state,
                openKeys: getDefaultCollapsedSubMenus(menuPath),
                isSidebarExpanded: props.isSidebarExpanded
            };
        }
        
        return null;
    }
    
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            openKeys: []
        };
    }

    handleClearClick = () => {
        if(this.keywordInput)
            this.keywordInput.value = '';
        this.setState({keyword: ''});
    }

    handleKeywordChange = e => {
        this.setState({keyword: e.target.value});
    }

    setKeywordInput = input => {
        this.keywordInput = input;
    }

    /**
     * 判断是否是http链接.
     * @memberof SiderMenu
     */
    getMenuItemPath = item => {
        const itemPath = this.conversionPath(item.url);
        const icon = getIcon(item.icon);
        const {target, title} = item;
        return (
            <a href={itemPath} target={target}>
                {icon}
                <span>{title}</span>
            </a>
        );
    };

    /**
     * get SubMenu or Item
     */
    getSubMenuOrItem = item => {
        if(item.items && item.items.some(child => child.title)) {
            // 最近访问子元素 level 重设
            // 避免 level 0 MenuItem paddingLeft 重设被应用到最近访问菜单中
            const isRecent = item.title === this.props.intl.formatMessage({
                id: 'SHELL_MENU_RECENT',
                defaultMessage: '最近访问'
            });
            if(isRecent)
                item.items = item.items.map(item => ({
                    ...item,
                    level: 1
                }));
            
            const childrenItems = this.getNavMenuItems(item.items);
            const strTitle = typeof(item.title) === 'string';

            // 当无子菜单时就不展示菜单
            if(childrenItems && childrenItems.length > 0) {
                /* eslint-disable curly */
                const MenuTopItem = () => <div title={strTitle ? item.title : ''} className="ant-menu-item-group-title">
                    {getIcon(item.icon)}
                    {item.title ? <span>{item.title}</span> : item.title}
                </div>;
                if(item.level === 0) {
                    return [
                        <MenuTopItem key={item.key} />,
                        ...childrenItems
                    ];
                }
                // 最近访问高亮样式清除
                const styles = isRecent ? {color: 'rgba(255, 255, 255, 0.65)'} : {};

                return (
                    <SubMenu
                        title={item.icon ? (
                            <span>
                                {getIcon(item.icon)}
                                <span>{item.title}</span>
                            </span>
                        ) : (
                            item.title
                        )}
                        style={styles}
                        key={item.key}>
                        {childrenItems}
                    </SubMenu>
                );
            }
        
            return null;
        }
        menuItemKeyMap[item.url] = item;
        return (
            <Menu.Item
                key={item.url}
                className={{
                    menuTopItem: item.level === 0
                }}
                title={item.title}>
                {this.getMenuItemPath(item)}
            </Menu.Item>
        );
    };

    /**
     * 获得菜单子节点
     * @memberof SiderMenu
     */
    getNavMenuItems = menusData => {
        if(!menusData)
            return [];

        return menusData
            .filter(item => item.title && !item.hideInMenu)
            .map(item => this.getSubMenuOrItem(item))
            .filter(item => item);
    };


    /**
     * 根据 keyword 过滤 menu
     */
    filterMenusData = menusData => {
        let keyword = this.state.keyword;
        if(!isValidString(keyword))
            return menusData;

        keyword = keyword.toLowerCase();

        const isValidItem = item => {
            if(item.level < this.props.menuMinSearchLevel)
                return false;
            return (item.initial && item.initial.toLowerCase().indexOf(keyword) > -1) ||
            (item.pinyin && item.pinyin.toLowerCase().indexOf(keyword) > -1) ||
            (item.title && item.title.toLowerCase().indexOf(keyword) > -1);
        };

        const result = [];
        menusData.forEach(item => {
            if(item.items) {
                if(isValidItem(item)) {
                    result.push(item);
                    return;
                }
                const filteredItems = this.filterMenusData(item.items);
                if(filteredItems.length > 0) {
                    const newItem = Object.assign({}, item);
                    newItem.items = filteredItems;
                    result.push(newItem);
                }
            } else if(isValidString(item.url) && isValidItem(item))
                result.push(item);
        });
        return result;
    }

    handleMoveMenuSystem = () => this.props.setMenuSystemPosition({position: this.props.menuSystemPosition === 'bottom' ? 'top' : 'bottom'});

    /**
     * 添加菜单 最近访问
     */
    addRecentMenu = menusData => {
        const position = this.props.menuSystemPosition;
        if(position === 'none')
            return menusData;

        const opt = position === 'bottom'
            ? <Icon className="menu-system-position-icon" title={
            this.props.intl.formatMessage({
                id: 'SHELL_MENU_SYSTEM_TO_TOP',
                defaultMessage: '移到顶部'
            })} type="arrow-up" onClick={this.handleMoveMenuSystem}/>
            : <Icon className="menu-system-position-icon" title={
            this.props.intl.formatMessage({
                id: 'SHELL_MENU_SYSTEM_TO_BOTTOM',
                defaultMessage: '移到底部'
            })} type="arrow-down" onClick={this.handleMoveMenuSystem}/>

        const title = this.props.intl.formatMessage({
            id: 'SHELL_MENU_SYSTEM',
            defaultMessage: '系统功能'
        });
        const menuSystem = position === 'top' || position === 'bottom'
            ? <div><span title={title}>{title}</span>{opt}</div>
            : title;

        const recentMenu = {
            title: menuSystem,
            level: 0,
            items: [{
                title: this.props.intl.formatMessage({
                    id: 'SHELL_MENU_RECENT',
                    defaultMessage: '最近访问'
                }),
                icon: 'clock-circle-o',
                items: (this.props.recents || []).filter(item => item.title && item.url)
            }]
        };
        return position === 'bottom' ? [...menusData, recentMenu] : [recentMenu, ...menusData];
    }

    // conversion Path
    // 转化路径
    conversionPath = path => {
        if(path && path.indexOf('http') === 0)
            return path;
        return `/${pathPrefix}/${path || ''}`.replace(/\/+/g, '/');
    };

    handleSelect = ({key}) => {
        const menu = menuItemKeyMap[key] || {title: ''};
  
        this.props.addRecent(menu);
    }

    handleOpenChange = openKeys => {
        this.setState({
            openKeys,
        });
    };

    render() {
        const {isSidebarExpanded, isBusy, menus} = this.props;

        const {openKeys} = this.state;
        const menuProps = isSidebarExpanded ? {openKeys} : {};
        
        const menusData = this.addRecentMenu(this.filterMenusData(menus));
        return (
            <div>
                <div className="logo">
                    <a href="/">
                        <img src={LogoIconURL} className="logo-icon" alt={this.props.intl.formatMessage({
                            id: 'SHELL_LOGO_ICON',
                            defaultMessage: '商标'
                        })} />
                        {isSidebarExpanded
                            ? <img src={LogoTitleURL} className="logo-title" alt={this.props.intl.formatMessage({
                                id: 'SHELL_LOGO_TITLE',
                                defaultMessage: '商标标题'
                            })} />
                            : ''}
                    </a>
                </div>
                <Spin spinning={isBusy} delay={100} size="large">
                    <ul className="sidebar">
                        <li>
                            <div className="sidebar-serach-container">
                                <div className={classNames('sidebar-serach-border', {'no-border': !isSidebarExpanded})}>
                                    <input
                                        className={classNames('sidebar-serach-input',
                                            {'width-auto': isSidebarExpanded},
                                            {'width-0': !isSidebarExpanded})}
                                        type="text"
                                        placeholder={this.props.intl.formatMessage({
                                            id: 'SHELL_SEARCH_MENUS',
                                            defaultMessage: '在菜单中搜索'
                                        })}
                                        ref={this.setKeywordInput}
                                        onChange={this.handleKeywordChange}/>
                                    <span>
                                        <a
                                            className={classNames('btn',
                                                {invisible: !isValidString(this.state.keyword)})}
                                            onClick={this.handleClearClick}>
                                            <Icon
                                                className={classNames('sidebar-serach-button',
                                                    {'no-display': !isSidebarExpanded || this.state.keyword === ''
                                                    })} type="close-circle-o">
                                            </Icon>
                                            <Icon
                                                className={classNames('sidebar-serach-button',
                                                    {'no-display': !isSidebarExpanded || this.state.keyword !== ''
                                                    })} type="search">
                                            </Icon>
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </li>
                        <div className={isSidebarExpanded ? '' : 'menu-fold'}>
                            <PerfectScrollbar className="scrollbar" containerRef={ref => (scrollRef = ref)}>
                                <Menu className="shell-sidebar-menu" theme="dark" mode="inline"
                                    {...menuProps}
                                    onOpenChange={this.handleOpenChange}
                                    onSelect={this.handleSelect}
                                    selectedKeys={selectedKeys}>
                                    {this.getNavMenuItems(menusData)}
                                </Menu>
                            </PerfectScrollbar>
                        </div>
                    </ul>
                </Spin>
            </div>
        );
    }
}

export let menuItemType = null;
menuItemType = {
    title: PropTypes.string,
    activeId: PropTypes.string,
    icon: PropTypes.string,
    iconType: PropTypes.number,
    menus: PropTypes.arrayOf(PropTypes.shape(menuItemType)),
    url: PropTypes.string
};
SidebarMenu.propTypes = {
    addRecent: PropTypes.func,
    intl: PropTypes.object,
    isBusy: PropTypes.bool,
    isSidebarExpanded: PropTypes.bool,
    menuSystemPosition: PropTypes.oneOf(['none', 'top', 'bottom', '']),
    location: PropTypes.object,
    menuMinSearchLevel: PropTypes.number,
    menuPath: PropTypes.array,
    menus: PropTypes.arrayOf(PropTypes.shape(menuItemType)),
    recents: PropTypes.arrayOf(PropTypes.shape(menuItemType)),
    setMenuPath: PropTypes.func,
    setMenuSystemPosition: PropTypes.func,
};

import {connect} from '@shsdt/web-shared/lib/utils/connectExtended';
import {createSelector} from 'reselect';

import {injectIntl} from '../intl';
import {shellAddRecent, shellSetMenuPath, shellSetMenuSystemPosition} from '@shsdt/web-shared/lib/actions/shell';

const EMPTY_ARRAY = [];

const menusSelector = createSelector(
    state => state.getIn(['shell', 'ui', 'menus']),
    menus => (menus && menus.toJS()) || EMPTY_ARRAY
);

const recentsSelector = createSelector(
    state => state.getIn(['shell', 'ui', 'recents']),
    recents => (recents && recents.toJS()) || EMPTY_ARRAY
);

const mapStateToProps = state => ({
    menuSystemPosition: state.getIn(['shell', 'ui', 'menuSystemPosition']),
    isSidebarExpanded: (state.getIn(['shell', 'ui', 'isSidebarExpanded']) && true) || false,
    isBusy: (state.getIn(['shell', 'ui', 'isBusy']) && true) || false,
    menus: menusSelector(state),
    recents: recentsSelector(state),
    menuMinSearchLevel: state.getIn(['shell', 'ui', 'menuMinSearchLevel'])
});


const mapDispatchToProps = dispatch => ({
    addRecent: menu => dispatch(shellAddRecent(menu)),
    setMenuPath: menus => dispatch(shellSetMenuPath(menus)),
    setMenuSystemPosition: position => dispatch(shellSetMenuSystemPosition(position))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SidebarMenu));
