import { createApp } from 'vue'
import App from './views/App.vue'
import components from '../components'
import router from './router'
import Preview from './views/Preview.vue'
import './assets/css/markdown.css'

const app = createApp(App)
app.component('Preview', Preview)
app.use(router).use(components).mount('#app')
