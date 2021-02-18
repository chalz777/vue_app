import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import vuetoastify from './plugins/toastify';
import globals from './plugins/globals';

Vue.config.productionTip = false
Vue.use(vuetoastify)
Vue.use(globals)

new Vue({
  router,
    vuetify,   
  render: h => h(App)
}).$mount('#app')
