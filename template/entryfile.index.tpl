<%= importBootstrapper %>
import shell from '<%= shell %>';

const runtimeConfig = <%= runtimeConfig %>;
const globalConfig = <%= globalConfig %>;

const topMenuData = [];
<% topMenus.forEach((menu,index) => { %>
import menu<%= index+1 %> from '<%= menu.path %>';
topMenuData.push(menu<%= index+1 %>(runtimeConfig)); 
<% }) %>

const pageDatas = {};
<% componentModules.forEach((component,index) => { %>
import page<%= index+1 %> from '<%= component.path %>';
pageDatas['/<%= component.name %>'] = {
    component: page<%= index+1 %>
};
<% }) %>

const bootstrapper = new Bootstrapper({
    shellData: shell(runtimeConfig),
    pageData: pageDatas,
    topMenuData,
    options: {
        basePath: runtimeConfig.basePath,
        root: runtimeConfig.root,
        languages: runtimeConfig.languages,
        defaultLanguage: runtimeConfig.defaultLanguage,
        loginUrl: globalConfig.loginUrl,
        logoutUrl: globalConfig.logoutUrl,
        resetPasswordUrl: globalConfig.resetPasswordUrl,
    }
});

bootstrapper.run();
