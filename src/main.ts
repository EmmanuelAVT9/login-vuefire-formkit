import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { plugin } from '@formkit/vue'
import formKitConfig from './plugins/formkit.config'
import App from './App.vue'
import { auth } from './firebase'
import router from './router'

const app = createApp(App);

app.use(VueFire, {
  firebaseApp: auth.app,
  modules: [VueFireAuth()],
});

app.component('FontAwesomeIcon', FontAwesomeIcon)


app.use(router);

app.use(plugin, formKitConfig)

app.mount('#app');