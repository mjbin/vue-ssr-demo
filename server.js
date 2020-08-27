const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const koaStatic = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();

const isProd = process.env.NODE_ENV === 'production';
const resolve = file => path.resolve(__dirname, file);

// 开放dist目录
const serve = (p, cache) => koaStatic(resolve(p), {
  maxage: cache && isProd ? 60 * 60 * 24 * 30 * 1000 : 0,
  gzip: true,
});

app.use(serve('dist'));
app.use(mount('/act/', serve('dist')));

// 第 2 步：获得一个createBundleRenderer
const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require('./dist/vue-ssr-server-bundle.json'); // eslint-disable-line
const clientManifest = require('./dist/vue-ssr-client-manifest.json'); // eslint-disable-line

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: fs.readFileSync(path.resolve(__dirname, './src/index.template.html'), 'utf-8'),
  clientManifest,
});

function renderToString(context) {
  return new Promise((r, reject) => {
    renderer.renderToString(context, (err, html) => {
      if (err) {
        reject(err);
      }
      r(html);
    });
  });
}

// 第 3 步：添加一个中间件来处理所有请求
app.use(async (ctx, next) => {
  const context = {
    title: 'Hello SSR',
    url: ctx.url,
  };
  // 将 context 数据渲染为 HTML
  const html = await renderToString(context);
  // eslint-disable-next-line no-param-reassign
  ctx.body = html;
  next();
});

/* 服务启动 */
const port = process.env.port || 9004;
app.listen(port, () => {
  console.log(`server started at localhost: ${port}`);
});
