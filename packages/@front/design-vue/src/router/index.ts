import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router'

const routes = [{
  title: '按钮',
  name: 'Button',
  path: '/components/Button',
  component: () => import('../../components/button/docs/README.md'),
}, {
  title: '测试',
  name: 'Test',
  path: '/components/Test',
  component: () => import('../../components/test/docs/README.md'),
}]

const routerConfig = {
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to: any, from: any) {
    if (to.path !== from.path) {
      return { top: 0 };
    }
  },
};

const router = createRouter(routerConfig as RouterOptions);

export default router
