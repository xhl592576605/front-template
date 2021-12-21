import type { App, Plugin } from 'vue'
import Button from './Button.vue'

Button.install = function (app: App) {
  app.component(Button.name, Button);
  return app;
};

export { Button }

export default Button as typeof Button &
  Plugin & {
    readonly Button: typeof Button;
  }
