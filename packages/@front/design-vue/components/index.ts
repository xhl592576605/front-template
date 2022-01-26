import type { App } from 'vue';

import * as components from './components';
import { default as version } from './version';
export * from './components';

export const install = function (app: App) {
  Object.keys(components).forEach(key => {
    const component = components[key];
    if (component.install) {
      app.use(component);
    }
  });
  return app;
};

export { version };

export default {
  version,
  install,
};
