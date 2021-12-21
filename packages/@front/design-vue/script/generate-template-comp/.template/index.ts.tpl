import type { App, Plugin } from 'vue'
import {{ compName }} from './{{ compName }}.vue'

{{ compName }}.install = function (app: App) {
  app.component({{ compName }}.name, {{ compName }});
  return app;
};

export { {{ compName }} }

export default {{ compName }} as typeof {{ compName }} &
  Plugin & {
    readonly {{ compName }}: typeof {{ compName }};
  }
