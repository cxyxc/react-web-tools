## 本目录作用
* 作为 webpack dev server 的 contentBase （即开发服务器目录）
* 用于存储无法使用 webpack 打包的静态资源
    `开发时由 dev server 处理，打包时从该目录复制到产出目录`

### 该文件的作用是防止 git 忽略这个文件夹