import React from 'react';
import {SubApp, Loadable} from '<%= bootstrapper %>';
const loading = SubApp.loading;

const runtimeConfig = <%= runtimeConfig %>;

const LoadableComponent = Loadable.Map({
    loader: {
        page: () => import ('<%= page %>' /* webpackChunkName: "<%= name %>" */),
    },
    loading,
    render(loaded, props) {
        const page = loaded.page.default;
        const pageData = page(runtimeConfig);
        
        return (
            <SubApp {...pageData} {...props} name='/<%= name %>' />
        );
    }
});

export default LoadableComponent;
