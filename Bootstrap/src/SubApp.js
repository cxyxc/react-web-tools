import React, {Component} from 'react';
import Immutable from 'immutable';
import {combineReducers} from 'redux-immutable';
import {Provider} from 'react-redux';
import {Spin, Button} from 'antd';
import createStore from './createStore';
import routeManager from '@shsdt/web-shared/lib/utils/routeManager';
import cacheManager from '@shsdt/web-shared/lib/utils/cacheManager';

const emptyReducer = (state = Immutable.Map()) => state;
const routesFlag = {};

const styles = {
    position: 'absolute',
    left: '50%',
    marginLeft: '-16px',
    marginTop: '100px'
};

const reload = () => {
    window.location.reload();
};

/* eslint-disable react/prop-types */
const loading = props => {
    if(props.error) {
        console.error(`[react-loadable] ${props.error}`);
        return (<div style={styles}>Page failed to load! <Button onClick={reload}>Retry</Button></div>);
    } else if(props.pastDelay)
        // 超时情况处理，暂不启用，需要 LoadableComponent 配置 timeout 后方可生效
        // https://www.npmjs.com/package/react-loadable#optstimeout
        // else if(props.timedOut)
        //     return <div style={styles}>Taking a long time... <Button onClick={props.retry}>Retry</Button></div>;
        return <Spin size="large" style={styles} />;
    return null;
};

class SubApp extends Component {
    static loading = loading;
    constructor(props) {
        super(props);
        this.store = createStore({
            reducers: combineReducers({
                page: props.reducer || emptyReducer,
            }),
            initialState: {page: props.state},
            createOpts: {
                epics: props.epic
            }
        });

        // 控制 shell 显示隐藏
        props.setShellHide(props.shellHide);

        this.setManager({
            namespace: props.name,
            routes: props.routes,
            cacheConfig: props.cacheConfig,
        });
    }

    // 设置 Manager（与节点相关的 manager）
    setManager({
        namespace,
        routes,
        cacheConfig
    }) {
        const set = (name, boolen, func) => {
            if(boolen)
                func();
            else
                console.warn(`failed to set ${name}`);
        };

        // 路由管理器设置
        set('routeManager', routes, () => {
            if(routesFlag[namespace]) return;
            routeManager.setRoutes({
                namespace,
                routes
            });
            routes.setPageUrl(namespace);
            routesFlag[namespace] = true;
        });

        // 缓存配置设置(非必需)
        set('cacheManager', true, () => {
            cacheManager.init(cacheConfig);
        });
    }
        
    render() {
        const {match, location, history} = this.props;
        return (
            <Provider store={this.store}>
                <this.props.component match={match} location={location} history={history}/>
            </Provider>
        );
    }
}

export default SubApp;
