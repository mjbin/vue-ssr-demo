import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import createRouter from './router';
import createStore from './store';

Vue.config.productionTip = false;

const router = createRouter();
const store = createStore();

// 同步路由状态(route state)到 store
sync(store, router);

// 开发环境挂载内容
if (process.env.NODE_ENV !== 'production') {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}

// 正式模式
export default function createApp() {
  const app = new Vue({
    router,
    store,
    render: h => h(App),
  });
  return { app, router, store };
}
