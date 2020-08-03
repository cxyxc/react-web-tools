#### 当前目录存放一些静态资源，用于某些特殊实现

* global.css
    * 全局css文件，优先级高于其他css，用于覆盖css实现特定样式
    * 应在 web-main 中配置 CopyWebpackPlugin 插件实现功能
    * 此文件的作用是避免不使用该功能时引入css失败出现报错