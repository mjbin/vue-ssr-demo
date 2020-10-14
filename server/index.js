/* eslint-disable guard-for-in */
const Koa = require('koa');
const path = require('path');
const koaStatic = require('koa-static');
const mount = require('koa-mount');
const { createProxyMiddleware } = require('http-proxy-middleware');
const k2c = require('koa2-connect');

const app = new Koa();

const isProd = process.env.NODE_ENV === 'production';
const resolve = file => path.resolve(__dirname, file);
// 先开放dist目录
const serve = (p, cache) => koaStatic(resolve(p), {
  maxage: cache && isProd ? 60 * 60 * 24 * 180 * 1000 : 0,
  gzip: true,
});

if (!isProd) {
  // 开发模式下把请求的资源代理到vue-cli-services启动的服务上
  app.use(async (ctx, next) => {
    if (ctx.url.includes('.')) { // 匹配可能是资源的请求url
      // eslint-disable-next-line no-param-reassign
      ctx.respond = false;
      await k2c(createProxyMiddleware({
        target: 'http://localhost:8080',
      }))(ctx, next);
      return;
    }
    await next();
  });
} else {
  app.use(serve('../public', true));
  app.use(serve('../dist', true));
  app.use(mount('/act/', serve('../dist', true)));
}

// 路由
const router = !isProd ? require('./ssr.dev') : require('./ssr');

app.use(router.routes()).use(router.allowedMethods());

/* 服务启动 */
const port = process.env.PORT || 9004;
app.listen(port, () => {
  console.log(`server started at localhost: ${port}`);
});
