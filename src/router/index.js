import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

// fix error: UnhandledPromiseRejectionWarning:
//  NavigationDuplicated: Avoided redundant navigation to current
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/act/about/:id',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/test/hello',
    name: 'Hello',
    component: () => import(/* webpackChunkName: "hello" */ '../views/Hello.vue'),
  },
  // {
  //   path: '/seckill',
  //   name: 'Seckill',
  //   component: () => import('../pages/seckill/Index.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default function createRouter() {
  return router;
}
