const webpack = require('webpack');
const axios = require('axios');
const MemoryFS = require('memory-fs');
const fs = require('fs');
const path = require('path');
const Router = require('@koa/router');

// 1、webpack配置文件
// eslint-disable-next-line import/no-extraneous-dependencies
const webpackConfig = require('@vue/cli-service/webpack.config');
const { createBundleRenderer } = require('vue-server-renderer');
const { version } = require('../package.json');

// 2、编译webpack配置文件
const serverCompiler = webpack(webpackConfig);
const mfs = new MemoryFS();
// 指定输出到的内存流中
serverCompiler.outputFileSystem = mfs;

// 3、监听文件修改，实时编译获取最新的 vue-ssr-server-bundle.json
let bundle;
// let manifest;
serverCompiler.watch({}, (err, stats) => {
  if (err) {
    throw err;
  }
  // eslint-disable-next-line no-param-reassign
  stats = stats.toJson();
  stats.errors.forEach(error => console.error(error));
  stats.warnings.forEach(warn => console.warn(warn));
  const bundlePath = path.join(webpackConfig.output.path, 'vue-ssr-server-bundle.json');
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'));
  console.log('new bundle generated');
});

function renderToString(context, renderer) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      // eslint-disable-next-line no-unused-expressions
      err ? reject(err) : resolve(html);
    });
  });
}

const router = new Router();

router.get(/\.css$/, async (ctx) => {
  const resp = await axios.get(`http://localhost:8080${ctx.url}`);

  ctx.set('Content-Type', 'text/css');
  // eslint-disable-next-line no-param-reassign
  ctx.body = resp.data;
});

router.get(/\.js$/, async (ctx) => {
  const resp = await axios.get(`http://localhost:8080${ctx.url}`);

  ctx.set('Content-Type', 'application/javascript');
  // eslint-disable-next-line no-param-reassign
  ctx.body = resp.data;
});

router.get('(.*)', async (ctx, next) => {
  const context = {
    title: '健客网上药店',
    keywords: '健客网上药店',
    description: '健客网上药店',
    url: ctx.url,
    appEnv: {
      version,
    },
  };

  const clientManifestResp = await axios.get('http://localhost:8080/act/vue-ssr-client-manifest.json');
  const clientManifest = clientManifestResp.data;

  const renderer = createBundleRenderer(bundle, {
    // runInNewContext: false,
    template: fs.readFileSync(path.resolve(__dirname, '../src/index.template.html'), 'utf-8'),
    clientManifest,
  });

  // 将 context 数据渲染为 HTML
  const html = await renderToString(context, renderer);
  // eslint-disable-next-line no-param-reassign
  ctx.body = html;
  next();
});

module.exports = router;
