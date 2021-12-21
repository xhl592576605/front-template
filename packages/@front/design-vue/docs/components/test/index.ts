import type { App, Plugin } from 'vue'
import Test from './Test.vue'

Test.install = function (app: App) {
  app.component(Test.name, Test);
  return app;
};

export { Test }

export default Test as typeof Test &
  Plugin & {
    readonly Test: typeof Test;
  }
