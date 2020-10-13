/* eslint-disable guard-for-in */
const fs = require('fs');
const path = require('path');
const Router = require('@koa/router');
const { version } = require('../package.json');

const router = new Router();

// 获得一个createBundleRenderer
const { createBundleRenderer } = require('vue-server-renderer'); // eslint-disable-line
const serverBundle = require('../dist/vue-ssr-server-bundle.json'); // eslint-disable-line
const clientManifest = require('../dist/vue-ssr-client-manifest.json'); // eslint-disable-line

const renderer = createBundleRenderer(serverBundle, {
  // runInNewContext: false,
  template: fs.readFileSync(path.resolve(__dirname, '../src/index.template.html'), 'utf-8'),
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
  // 将 context 数据渲染为 HTML
  const html = await renderToString(context);
  // eslint-disable-next-line no-param-reassign
  ctx.body = html;
  next();
});

module.exports = router;
