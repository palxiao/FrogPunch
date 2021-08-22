import Vue from 'vue';
import Router from 'vue-router';
import hook from './hook'

Vue.use(Router);

import Base from './Base'

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'index',
    //   component: () => import('@/views/Index.vue'),
    // },
    ...Base,
  ],
});

hook(router)

export default router

