import { App, defineComponent, Plugin } from 'vue';
import png from '../sheet-music/assets/images/动画头像.png'
const SheetMusic = defineComponent({
  name: 'SheetMusic',
  setup() {
    return {
      png
    }
  },
  render() {
    return (
      <>
        <div class="sheet-music">msdkfk</div>
        <img src={png}></img>
      </>
    )
  }
})

SheetMusic.install = function (app: App) {
  app.component(SheetMusic.name, SheetMusic);
  return app;
};


export default SheetMusic as typeof SheetMusic &
  Plugin
