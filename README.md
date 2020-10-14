# vue-ssr-demo

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
yarn start
```

### Lints and fixes files
```
yarn lint
```

### 部署流程
```
1.构建完成部署到服务器后，需要把server目录复制到服务端放dist的目录
2.需要把/src/index.template.html 复制到dist/src/index.template.html
3.之后在dist目录下执行node server.js即可启动项目服务（参考Dockerfile）
```

## 注意

如果需要设置静态资源目录，需要配置`vue.config.js`的publicPath路径
```js
publicPath: '/act', // 设置静态资源目录
```
然后在server.js设置
```js
const serve = (p, cache) => koaStatic(resolve(p), {
  maxage: cache && isProd ? 60 * 60 * 24 * 30 * 1000 : 0,
  gzip: true,
});

app.use(mount('/act/', serve('dist')));
```

> vue-cli构建的项目建议用.env环境变量来配置。如果需要自定义的服务端环境变量，比如在server.js 中新增了process.env.test = myTest，那么在entry-server.js是读取不到的

## 项目缺点
* 开发模式下的hmr暂时无法由koa服务来更新
* ~~开发模式下通过koa来访问vue-cli-services的服务，需要手动补全请求的资源文件和类型，比较繁琐~~，通过开发模式代理资源文件解决

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
